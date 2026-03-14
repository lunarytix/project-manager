import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Appearance, CreateAppearanceRequest, UpdateAppearanceRequest } from '../models/appearance.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppearanceService {
  private readonly apiUrl = `${environment.apiUrl}/appearance`;
  private currentThemeSubject = new BehaviorSubject<Appearance | null>(null);
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadDefaultTheme();
  }

  getAll(): Observable<Appearance[]> {
    return this.http.get<Appearance[]>(this.apiUrl);
  }

  getById(id: string): Observable<Appearance> {
    return this.http.get<Appearance>(`${this.apiUrl}/${id}`);
  }

  getDefault(): Observable<Appearance> {
    return this.http.get<Appearance>(`${this.apiUrl}/default`).pipe(
      tap(theme => this.applyTheme(theme))
    );
  }

  create(theme: CreateAppearanceRequest): Observable<Appearance> {
    return this.http.post<Appearance>(this.apiUrl, theme);
  }

  update(id: string, theme: UpdateAppearanceRequest): Observable<Appearance> {
    return this.http.patch<Appearance>(`${this.apiUrl}/${id}`, theme);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  setAsDefault(id: string): Observable<Appearance> {
    return this.http.post<Appearance>(`${this.apiUrl}/${id}/set-default`, {}).pipe(
      tap(theme => this.applyTheme(theme))
    );
  }

  applyTheme(theme: Appearance): void {
    this.currentThemeSubject.next(theme);

    // Apply CSS custom properties
    const root = document.documentElement;
    
    // Primary colors
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-primary-dark', theme.primaryDarkColor);
    root.style.setProperty('--color-primary-light', theme.primaryLightColor);
    
    // Secondary colors
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-secondary-dark', theme.secondaryDarkColor);
    root.style.setProperty('--color-secondary-light', theme.secondaryLightColor);
    
    // Tertiary colors
    root.style.setProperty('--color-tertiary', theme.tertiaryColor);
    root.style.setProperty('--color-tertiary-dark', theme.tertiaryDarkColor);
    root.style.setProperty('--color-tertiary-light', theme.tertiaryLightColor);
    
    // Background colors
    root.style.setProperty('--color-background', theme.backgroundColor);
    root.style.setProperty('--color-background-secondary', theme.backgroundSecondaryColor);
    root.style.setProperty('--color-border', theme.borderColor);
    
    // Text colors
    root.style.setProperty('--color-text-primary', theme.textPrimaryColor);
    root.style.setProperty('--color-text-secondary', theme.textSecondaryColor);
    root.style.setProperty('--color-text-muted', theme.textMutedColor);
    
    // Status colors
    root.style.setProperty('--color-danger', theme.dangerColor);
    root.style.setProperty('--color-success', theme.successColor);
    root.style.setProperty('--color-warning', theme.warningColor);
    root.style.setProperty('--color-info', theme.infoColor);

    // Typography
    root.style.setProperty('--font-family', theme.fontFamily);
    root.style.setProperty('--font-size', theme.fontSize);
    root.style.setProperty('--font-size-small', theme.fontSizeSmall);
    root.style.setProperty('--font-size-large', theme.fontSizeLarge);
    root.style.setProperty('--font-weight', theme.fontWeight);
    root.style.setProperty('--line-height', theme.lineHeight);
    root.style.setProperty('--letter-spacing', theme.letterSpacing);

    // Visual effects
    root.style.setProperty('--text-shadow', theme.textShadow);
    root.style.setProperty('--border-radius', theme.borderRadius);
    root.style.setProperty('--border-radius-small', theme.borderRadiusSmall);
    root.style.setProperty('--border-radius-large', theme.borderRadiusLarge);
    root.style.setProperty('--box-shadow', theme.boxShadow);
    root.style.setProperty('--backdrop-blur', theme.backdropBlur);
    root.style.setProperty('--background-opacity', theme.backgroundOpacity);

    // Input styles
    root.style.setProperty('--input-background-color', theme.inputBackgroundColor);
    root.style.setProperty('--input-border-color', theme.inputBorderColor);
    root.style.setProperty('--input-focus-color', theme.inputFocusColor);
    root.style.setProperty('--input-padding', theme.inputPadding);

    // Glass effect class toggle
    if (theme.glassEffect) {
      document.body.classList.add('glass-theme');
    } else {
      document.body.classList.remove('glass-theme');
    }

    // Store in localStorage for persistence
    localStorage.setItem('selectedTheme', JSON.stringify(theme));
  }

  private loadDefaultTheme(): void {
    // Load from API first to ensure we have the current default
    this.getDefault().subscribe({
      next: (theme) => {
        // Theme is applied via tap operator in getDefault
        console.log('Default theme loaded:', theme.name);
      },
      error: (error) => {
        console.error('Error loading default theme:', error);
        
        // Try to load from localStorage as fallback
        const storedTheme = localStorage.getItem('selectedTheme');
        if (storedTheme) {
          try {
            const theme = JSON.parse(storedTheme);
            this.applyTheme(theme);
          } catch (parseError) {
            console.warn('Error parsing stored theme');
          }
        }
      }
    });
  }

  getCurrentTheme(): Appearance | null {
    return this.currentThemeSubject.value;
  }
}