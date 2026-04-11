export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: string;
  nombre: string;
  email: string;
  roleId: string;
  photo?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  usuario?: {
    id: string;
    nombre: string;
    email: string;
    roleId: string;
    photo?: string;
  };
  token?: string;
}
