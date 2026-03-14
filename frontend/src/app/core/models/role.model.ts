export interface Role {
  id?: string;
  nombre: string;
  descripcion: string;
  permisos: string[];
  activo: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export enum RoleType {
  ADMIN = 'admin',
  COLABORADOR = 'colaborador'
}
