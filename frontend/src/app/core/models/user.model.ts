export interface User {
  id?: string;
  nombre: string;
  email: string;
  password?: string;
  roleId: string;
  activo: boolean;
  photo?: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  createdAt?: Date;
  updatedAt?: Date;
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
  photo?: string;
}
