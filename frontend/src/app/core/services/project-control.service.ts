import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateProjectControlRequest,
  InitProjectDatabaseRequest,
  ProjectControl,
} from '../models/project-control.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectControlService {
  private apiUrl = `${environment.apiUrl}/project-control`;

  constructor(private readonly http: HttpClient) {}

  create(payload: CreateProjectControlRequest): Observable<ProjectControl> {
    return this.http.post<ProjectControl>(this.apiUrl, payload);
  }

  findAll(): Observable<ProjectControl[]> {
    return this.http.get<ProjectControl[]>(this.apiUrl);
  }

  initDatabase(id: string, payload: InitProjectDatabaseRequest): Observable<ProjectControl> {
    return this.http.post<ProjectControl>(`${this.apiUrl}/${id}/database/init`, payload);
  }

  download(id: string): Observable<ProjectControl> {
    return this.http.post<ProjectControl>(`${this.apiUrl}/${id}/download`, {});
  }

  deploy(id: string): Observable<ProjectControl> {
    return this.http.post<ProjectControl>(`${this.apiUrl}/${id}/deploy`, {});
  }

  restart(id: string): Observable<ProjectControl> {
    return this.http.post<ProjectControl>(`${this.apiUrl}/${id}/restart`, {});
  }

  stop(id: string): Observable<ProjectControl> {
    return this.http.post<ProjectControl>(`${this.apiUrl}/${id}/stop`, {});
  }
}
