import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginRequest, LoginResponse, AuthState } from '../models/auth.model';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private authState = new BehaviorSubject<AuthState>({ isAuthenticated: false });

  public authState$ = this.authState.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private buildAssetUrl(photo?: string): string | undefined {
    if (!photo) return undefined;
    if (/^https?:\/\//i.test(photo)) return photo;
    const baseApi = environment.apiUrl.replace(/\/api\/?$/, '');
    return `${baseApi}${photo.startsWith('/') ? '' : '/'}${photo}`;
  }

  private normalizeUser(userObj: any): any {
    if (!userObj) return userObj;
    return {
      ...userObj,
      photo: this.buildAssetUrl(userObj.photo)
    };
  }

  private initializeAuth(): void {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    if (token && usuario) {
      const userObj = this.normalizeUser(JSON.parse(usuario));
      // if roleId looks like a role name (not a UUID), try to resolve to actual role id
      if (userObj && userObj.roleId && typeof userObj.roleId === 'string' && userObj.roleId.length < 40) {
        fetch(`${environment.apiUrl}/roles`)
          .then(r => r.json())
          .then((roles: any[]) => {
            const found = roles.find(r => r.nombre === userObj.roleId);
            if (found) {
              userObj.roleId = found.id;
              localStorage.setItem('usuario', JSON.stringify(userObj));
            }
            this.authState.next({ isAuthenticated: true, token, usuario: userObj });
          })
          .catch(() => {
            this.authState.next({ isAuthenticated: true, token, usuario: userObj });
          });
      } else {
        this.authState.next({
          isAuthenticated: true,
          token,
          usuario: userObj
        });
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          const normalizedUser = this.normalizeUser({
            id: response.id,
            nombre: response.nombre,
            email: response.email,
            roleId: response.roleId,
            photo: response.photo
          });
          localStorage.setItem('token', response.token);
          localStorage.setItem('usuario', JSON.stringify(normalizedUser));
          this.authState.next({
            isAuthenticated: true,
            token: response.token,
            usuario: normalizedUser
          });
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.authState.next({ isAuthenticated: false });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? this.normalizeUser(JSON.parse(usuario)) : null;
  }

  updateCurrentUser(partialUser: any): void {
    const current = this.getCurrentUser();
    if (!current) return;

    const updated = this.normalizeUser({ ...current, ...partialUser });
    localStorage.setItem('usuario', JSON.stringify(updated));
    this.authState.next({
      isAuthenticated: true,
      token: this.getToken() || undefined,
      usuario: updated
    });
  }

  isAuthenticated(): boolean {
    return this.authState.value.isAuthenticated;
  }
}
