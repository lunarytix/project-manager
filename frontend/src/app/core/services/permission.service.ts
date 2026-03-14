import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Permission {
  id?: string;
  role: { id: string; nombre?: string };
  module: { id: string; nombre?: string };
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private apiUrl = `${environment.apiUrl}/permissions`;
  constructor(private http: HttpClient) {}

  getByModule(moduleId: string): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/module/${moduleId}`);
  }

  getByRole(roleId: string): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/role/${roleId}`);
  }

  create(data: any) { return this.http.post<Permission>(this.apiUrl, data); }
  update(id: string, data: any) { return this.http.put<Permission>(`${this.apiUrl}/${id}`, data); }
  remove(id: string) { return this.http.delete<void>(`${this.apiUrl}/${id}`); }

  updateRolePermissions(roleId: string, permissions: any[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/role/${roleId}/update`, { permissions });
  }
}
