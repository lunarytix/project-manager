export type ProjectScope = 'auto' | 'frontend' | 'backend' | 'fullstack';

export interface ProjectControl {
  id: string;
  nombre: string;
  descripcion: string | null;
  gitUrl: string;
  gitBranch: string;
  scope: ProjectScope;
  localPath: string | null;
  status: string;
  lastAction: string | null;
  lastOutput: string | null;
  dbEngine: string;
  dbName: string | null;
  dbFilePath: string | null;
  installCommand: string;
  startCommand: string | null;
  frontendStartCommand: string | null;
  backendStartCommand: string | null;
  runtime: {
    rootPid?: number;
    frontendPid?: number;
    backendPid?: number;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectControlRequest {
  nombre: string;
  descripcion?: string;
  gitUrl: string;
  gitBranch?: string;
  scope?: ProjectScope;
  dbName?: string;
  dbEngine?: string;
  installCommand?: string;
  startCommand?: string;
  frontendStartCommand?: string;
  backendStartCommand?: string;
}

export interface InitProjectDatabaseRequest {
  dbName?: string;
  sqlContent: string;
}
