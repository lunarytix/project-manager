export interface Module {
  id?: string;
  nombre: string;
  descripcion: string;
  icono: string;
  ruta: string;
  rolesPermitidos: string[];
  activo: boolean;
  orden: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface CreateModuleRequest {
  nombre: string;
  descripcion: string;
  icono: string;
  ruta: string;
  rolesPermitidos: string[];
}

export interface UpdateModuleRequest {
  nombre?: string;
  descripcion?: string;
  icono?: string;
  ruta?: string;
  rolesPermitidos?: string[];
  activo?: boolean;
  orden?: number;
}
