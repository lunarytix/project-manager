export interface User {
  id?: string;
  nombre: string;
  email: string;
  password?: string;
  roleId: string;
  activo: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

export interface CreateUserRequest {
  nombre: string;
  email: string;
  password: string;
  roleId: string;
}

export interface UpdateUserRequest {
  nombre?: string;
  email?: string;
  roleId?: string;
  activo?: boolean;
}
