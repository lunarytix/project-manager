import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PermissionCatalogService {
  private apiUrl = `${environment.apiUrl}/permission-catalogs`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> { return this.http.get<any[]>(this.apiUrl); }
  get(id: string) { return this.http.get<any>(`${this.apiUrl}/${id}`); }
  create(data: any) { return this.http.post(this.apiUrl, data); }
  update(id: string, data: any) { return this.http.put(`${this.apiUrl}/${id}`, data); }
  remove(id: string) { return this.http.delete(`${this.apiUrl}/${id}`); }

  addMappings(permissionId: string, catalogIds: string[]) {
    return this.http.post(`${this.apiUrl}/${permissionId}/mappings`, { catalogIds });
  }

  getMappings(permissionId: string) { return this.http.get<any[]>(`${this.apiUrl}/${permissionId}/mappings`); }

  removeMapping(permissionId: string, catalogId: string) {
    return this.http.delete(`${this.apiUrl}/${permissionId}/mappings/${catalogId}`);
  }
}
