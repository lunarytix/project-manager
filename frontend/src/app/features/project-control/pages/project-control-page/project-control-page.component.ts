import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent, DynamicFormConfig } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { GenericTableComponent, TableColumn } from '../../../../shared/components/generic-table/generic-table.component';
import { FrontendAuditService } from '../../../../core/services/frontend-audit.service';
import { ProjectControlService } from '../../../../core/services/project-control.service';
import { ProjectControl } from '../../../../core/models/project-control.model';

@Component({
  selector: 'app-project-control-page',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent, GenericTableComponent],
  templateUrl: './project-control-page.component.html',
  styleUrls: ['./project-control-page.component.scss']
})
export class ProjectControlPageComponent implements OnInit {
  loading = false;
  saving = false;
  error: string | null = null;
  info: string | null = null;

  projects: ProjectControl[] = [];

  formConfig: DynamicFormConfig = {
    layout: 'grid',
    gridColumns: 2,
    submitButton: {
      label: 'Crear proyecto de software',
      variant: 'primary',
    },
    fields: [
      { key: 'nombre', type: 'text', label: 'Nombre del proyecto', required: true, order: 1 },
      { key: 'descripcion', type: 'textarea', label: 'Descripcion', order: 2 },
      { key: 'gitUrl', type: 'text', label: 'URL Git', placeholder: 'https://github.com/owner/repo.git', required: true, order: 3 },
      { key: 'gitBranch', type: 'text', label: 'Rama', value: 'main', order: 4 },
      {
        key: 'scope',
        type: 'select',
        label: 'Tipo de proyecto',
        value: 'auto',
        options: [
          { label: 'Auto detectar', value: 'auto' },
          { label: 'Frontend', value: 'frontend' },
          { label: 'Backend', value: 'backend' },
          { label: 'Fullstack', value: 'fullstack' },
        ],
        order: 5,
      },
      { key: 'dbName', type: 'text', label: 'Nombre DB (opcional)', order: 6 },
      { key: 'sqlContent', type: 'textarea', label: 'SQL inicial (opcional)', placeholder: 'CREATE TABLE ...;', order: 7 },
      { key: 'installCommand', type: 'text', label: 'Comando install', value: 'npm install', order: 8 },
      { key: 'startCommand', type: 'text', label: 'Comando start raiz (backend/frontend simple)', value: 'npm run start', order: 9 },
      { key: 'frontendStartCommand', type: 'text', label: 'Comando start frontend (fullstack)', value: 'npm start', order: 10 },
      { key: 'backendStartCommand', type: 'text', label: 'Comando start backend (fullstack)', value: 'npm run start', order: 11 },
    ],
  };

  tableColumns: TableColumn[] = [
    { key: 'nombre', label: 'Proyecto' },
    { key: 'scope', label: 'Tipo' },
    { key: 'gitBranch', label: 'Rama' },
    { key: 'status', label: 'Estado' },
    { key: 'lastAction', label: 'Ultima accion' },
    { key: 'dbName', label: 'DB' },
  ];

  projectActions = [
    { key: 'download', label: 'Descargar/Actualizar repo', icon: 'download', color: 'primary' as const },
    { key: 'deploy', label: 'Deploy', icon: 'play_arrow', color: 'success' as const },
    { key: 'restart', label: 'Reiniciar', icon: 'restart_alt', color: 'warning' as const },
    { key: 'stop', label: 'Detener', icon: 'stop', color: 'danger' as const },
  ];

  constructor(
    private readonly service: ProjectControlService,
    private readonly frontendAudit: FrontendAuditService,
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = null;

    this.service.findAll().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo cargar la lista de proyectos';
        this.loading = false;
      }
    });
  }

  onCreateProject(formValue: any): void {
    this.saving = true;
    this.error = null;
    this.info = null;

    this.frontendAudit.logAction('Crear proyecto de software', {
      nombre: formValue.nombre,
      scope: formValue.scope,
      gitBranch: formValue.gitBranch,
    }, 'ProjectControlPageComponent');

    this.service.create({
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      gitUrl: formValue.gitUrl,
      gitBranch: formValue.gitBranch,
      scope: formValue.scope,
      dbName: formValue.dbName,
      installCommand: formValue.installCommand,
      startCommand: formValue.startCommand,
      frontendStartCommand: formValue.frontendStartCommand,
      backendStartCommand: formValue.backendStartCommand,
    }).subscribe({
      next: (project) => {
        const sqlContent = (formValue.sqlContent || '').trim();
        if (sqlContent) {
          this.service.initDatabase(project.id, {
            dbName: formValue.dbName,
            sqlContent,
          }).subscribe({
            next: () => {
              this.info = 'Proyecto creado y base de datos inicializada';
              this.saving = false;
              this.loadProjects();
            },
            error: (err) => {
              this.error = err?.error?.message || 'Proyecto creado, pero fallo la inicializacion SQL';
              this.saving = false;
              this.loadProjects();
            },
          });
        } else {
          this.info = 'Proyecto creado correctamente';
          this.saving = false;
          this.loadProjects();
        }
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo crear el proyecto';
        this.saving = false;
      },
    });
  }

  onProjectAction(event: { key: string; row: any }): void {
    const project = event.row as ProjectControl;
    const actionKey = event.key;

    this.frontendAudit.logAction('Accion de control de proyecto', {
      action: actionKey,
      projectId: project.id,
      projectName: project.nombre,
    }, 'ProjectControlPageComponent');

    const actionCall =
      actionKey === 'download' ? this.service.download(project.id) :
      actionKey === 'deploy' ? this.service.deploy(project.id) :
      actionKey === 'restart' ? this.service.restart(project.id) :
      actionKey === 'stop' ? this.service.stop(project.id) : null;

    if (!actionCall) return;

    this.loading = true;
    actionCall.subscribe({
      next: () => {
        this.info = `Accion ${actionKey} ejecutada en ${project.nombre}`;
        this.loading = false;
        this.loadProjects();
      },
      error: (err) => {
        this.error = err?.error?.message || `No se pudo ejecutar ${actionKey}`;
        this.loading = false;
      },
    });
  }

}
