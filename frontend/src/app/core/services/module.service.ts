import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Module, CreateModuleRequest, UpdateModuleRequest } from '../models/module.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private apiUrl = `${environment.apiUrl}/modules`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Module[]> {
    return this.http.get<Module[]>(this.apiUrl);
  }

  getById(id: string): Observable<Module> {
    return this.http.get<Module>(`${this.apiUrl}/${id}`);
  }

  create(module: CreateModuleRequest): Observable<Module> {
    return this.http.post<Module>(this.apiUrl, module);
  }

  update(id: string, module: UpdateModuleRequest): Observable<Module> {
    return this.http.put<Module>(`${this.apiUrl}/${id}`, module);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByRole(roleId: string): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.apiUrl}/role/${roleId}`);
  }

  assignRoles(moduleId: string, roleIds: string[]): Observable<Module> {
    return this.http.post<Module>(`${this.apiUrl}/${moduleId}/roles`, { roleIds });
  }
}
