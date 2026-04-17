import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectControlDto } from './dto/create-project-control.dto';
import { InitProjectDatabaseDto } from './dto/init-project-database.dto';
import { UpdateProjectControlDto } from './dto/update-project-control.dto';
import { ProjectControlEntity, ProjectScope } from './project-control.entity';
import { existsSync, mkdirSync } from 'fs';
import { basename, join } from 'path';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class ProjectControlService {
  private readonly projectsRoot = join(process.cwd(), 'managed-projects');
  private readonly databasesRoot = join(process.cwd(), 'managed-databases');

  constructor(
    @InjectRepository(ProjectControlEntity)
    private readonly repo: Repository<ProjectControlEntity>,
  ) {}

  async create(dto: CreateProjectControlDto): Promise<ProjectControlEntity> {
    this.ensureRoots();

    const localPath = join(this.projectsRoot, this.toSlug(dto.nombre));

    const entity = this.repo.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? null,
      gitUrl: dto.gitUrl,
      gitBranch: dto.gitBranch || 'main',
      scope: dto.scope || 'auto',
      localPath,
      status: 'CREATED',
      lastAction: 'CREATE',
      dbEngine: dto.dbEngine || 'sqlite',
      dbName: dto.dbName || null,
      installCommand: dto.installCommand || 'npm install',
      startCommand: dto.startCommand || null,
      frontendStartCommand: dto.frontendStartCommand || null,
      backendStartCommand: dto.backendStartCommand || null,
      runtime: null,
    });

    return this.repo.save(entity);
  }

  findAll(): Promise<ProjectControlEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<ProjectControlEntity> {
    const item = await this.repo.findOne({ where: { id } as any });
    if (!item) throw new NotFoundException('Project control not found');
    return item;
  }

  async update(id: string, dto: UpdateProjectControlDto): Promise<ProjectControlEntity> {
    const item = await this.findOne(id);
    Object.assign(item, dto as any);
    return this.repo.save(item);
  }

  async remove(id: string): Promise<{ affected: number }> {
    const res = await this.repo.delete(id);
    return { affected: res.affected || 0 };
  }

  async downloadProject(id: string): Promise<ProjectControlEntity> {
    const project = await this.findOne(id);
    this.ensureRoots();

    const targetPath = project.localPath || join(this.projectsRoot, this.toSlug(project.nombre));
    project.localPath = targetPath;

    try {
      if (!existsSync(targetPath) || !existsSync(join(targetPath, '.git'))) {
        await execAsync(`git clone --branch ${project.gitBranch} --single-branch ${project.gitUrl} "${targetPath}"`);
      } else {
        await execAsync(`git -C "${targetPath}" fetch --all`);
        await execAsync(`git -C "${targetPath}" checkout ${project.gitBranch}`);
        await execAsync(`git -C "${targetPath}" pull origin ${project.gitBranch}`);
      }

      project.status = 'DOWNLOADED';
      project.lastAction = 'DOWNLOAD';
      project.lastOutput = `Proyecto sincronizado en rama ${project.gitBranch}`;
    } catch (error: any) {
      project.status = 'ERROR';
      project.lastAction = 'DOWNLOAD';
      project.lastOutput = error?.message || String(error);
    }

    return this.repo.save(project);
  }

  async initializeDatabase(id: string, dto: InitProjectDatabaseDto): Promise<ProjectControlEntity> {
    const project = await this.findOne(id);
    this.ensureRoots();

    const dbName = (dto.dbName || project.dbName || this.toSlug(project.nombre)).replace(/\.db$/i, '');
    const dbFilePath = join(this.databasesRoot, `${dbName}.db`);

    project.dbName = dbName;
    project.dbFilePath = dbFilePath;

    try {
      const ds = new DataSource({
        type: 'sqlite',
        database: dbFilePath,
        entities: [],
        synchronize: false,
      });

      await ds.initialize();

      const statements = this.splitSqlStatements(dto.sqlContent || '');
      for (const statement of statements) {
        await ds.query(statement);
      }

      await ds.destroy();

      project.lastAction = 'INIT_DATABASE';
      project.lastOutput = `Base de datos inicializada en ${dbFilePath} (${statements.length} sentencias)`;
      if (project.status !== 'ERROR') {
        project.status = 'CREATED';
      }
    } catch (error: any) {
      project.status = 'ERROR';
      project.lastAction = 'INIT_DATABASE';
      project.lastOutput = error?.message || String(error);
    }

    return this.repo.save(project);
  }

  async deployProject(id: string): Promise<ProjectControlEntity> {
    const project = await this.findOne(id);
    const basePath = project.localPath;

    if (!basePath || !existsSync(basePath)) {
      throw new NotFoundException('Proyecto no descargado en servidor. Ejecuta download primero.');
    }

    const runtime: { rootPid?: number; frontendPid?: number; backendPid?: number } = {};
    const outputs: string[] = [];

    try {
      const scope = this.resolveScope(project.scope, basePath);

      if (scope === 'fullstack') {
        const frontendPath = join(basePath, 'frontend');
        const backendPath = join(basePath, 'backend');

        if (existsSync(frontendPath)) {
          outputs.push(await this.runInstall(frontendPath, project.installCommand));
          runtime.frontendPid = this.runDetached(frontendPath, project.frontendStartCommand || 'npm start');
        }

        if (existsSync(backendPath)) {
          outputs.push(await this.runInstall(backendPath, project.installCommand));
          runtime.backendPid = this.runDetached(backendPath, project.backendStartCommand || 'npm run start');
        }
      } else if (scope === 'frontend' || scope === 'backend') {
        outputs.push(await this.runInstall(basePath, project.installCommand));
        runtime.rootPid = this.runDetached(basePath, project.startCommand || 'npm run start');
      } else {
        outputs.push(await this.runInstall(basePath, project.installCommand));
        runtime.rootPid = this.runDetached(basePath, project.startCommand || 'npm run start');
      }

      project.runtime = runtime;
      project.status = 'RUNNING';
      project.lastAction = 'DEPLOY';
      project.lastOutput = outputs.filter(Boolean).join('\n').slice(-4000);
    } catch (error: any) {
      project.status = 'ERROR';
      project.lastAction = 'DEPLOY';
      project.lastOutput = error?.message || String(error);
    }

    return this.repo.save(project);
  }

  async stopProject(id: string): Promise<ProjectControlEntity> {
    const project = await this.findOne(id);

    try {
      const runtime = project.runtime || {};
      this.killIfRunning(runtime.rootPid);
      this.killIfRunning(runtime.frontendPid);
      this.killIfRunning(runtime.backendPid);

      project.runtime = null;
      project.status = 'STOPPED';
      project.lastAction = 'STOP';
      project.lastOutput = 'Procesos detenidos';
    } catch (error: any) {
      project.status = 'ERROR';
      project.lastAction = 'STOP';
      project.lastOutput = error?.message || String(error);
    }

    return this.repo.save(project);
  }

  async restartProject(id: string): Promise<ProjectControlEntity> {
    await this.stopProject(id);
    return this.deployProject(id);
  }

  private ensureRoots(): void {
    if (!existsSync(this.projectsRoot)) mkdirSync(this.projectsRoot, { recursive: true });
    if (!existsSync(this.databasesRoot)) mkdirSync(this.databasesRoot, { recursive: true });
  }

  private toSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || basename(`project-${Date.now()}`);
  }

  private splitSqlStatements(sql: string): string[] {
    return sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => `${s};`);
  }

  private async runInstall(cwd: string, command: string): Promise<string> {
    const { stdout, stderr } = await execAsync(command, { cwd });
    return [stdout, stderr].filter(Boolean).join('\n').slice(-2000);
  }

  private runDetached(cwd: string, command: string): number {
    const child = spawn(command, {
      cwd,
      shell: true,
      detached: true,
      stdio: 'ignore',
    });

    child.unref();
    return child.pid || 0;
  }

  private killIfRunning(pid?: number): void {
    if (!pid) return;
    try {
      process.kill(pid);
    } catch {
      // ignore dead process
    }
  }

  private resolveScope(scope: ProjectScope, basePath: string): ProjectScope {
    if (scope !== 'auto') return scope;

    const hasFrontend = existsSync(join(basePath, 'frontend', 'package.json'));
    const hasBackend = existsSync(join(basePath, 'backend', 'package.json'));

    if (hasFrontend && hasBackend) return 'fullstack';
    if (hasFrontend) return 'frontend';
    if (hasBackend) return 'backend';
    return 'backend';
  }
}
