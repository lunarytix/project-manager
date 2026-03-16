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
    // Normalize possible rgba values: extract alpha for opacity and convert rgb to solid hex for color variables
    const normalizeRgba = (val?: string): { color?: string; alpha?: string } => {
      if (!val || typeof val !== 'string') return {};
      const rgbaMatch = val.match(/rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|0?\.\d+|1(?:\.0+)?))?\s*\)/);
      if (!rgbaMatch) return { color: val };
      const r = Math.max(0, Math.min(255, parseInt(rgbaMatch[1], 10)));
      const g = Math.max(0, Math.min(255, parseInt(rgbaMatch[2], 10)));
      const b = Math.max(0, Math.min(255, parseInt(rgbaMatch[3], 10)));
      const a = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;

      // Composite onto white if alpha < 1
      let rr = r, gg = g, bb = b;
      if (a < 1) {
        rr = Math.round((1 - a) * 255 + a * r);
        gg = Math.round((1 - a) * 255 + a * g);
        bb = Math.round((1 - a) * 255 + a * b);
      }
      const toHex = (n: number) => n.toString(16).padStart(2, '0');
      return { color: `#${toHex(rr)}${toHex(gg)}${toHex(bb)}`.toUpperCase(), alpha: String(a) };
    };

    const rgbString = (val?: string): string => {
      if (!val || typeof val !== 'string') return '255, 255, 255';
      const rgbaMatch = val.match(/rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
      if (rgbaMatch) {
        return `${Math.max(0, Math.min(255, Number(rgbaMatch[1])))}, ${Math.max(0, Math.min(255, Number(rgbaMatch[2])))} , ${Math.max(0, Math.min(255, Number(rgbaMatch[3])))} `;
      }
      // hex format #RRGGBB
      const hexMatch = val.match(/^#?([0-9a-fA-F]{6})$/);
      if (hexMatch) {
        const hex = hexMatch[1];
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g} , ${b}`;
      }
      return '255, 255, 255';
    };

    const bg = normalizeRgba(theme.backgroundColor as any);
    if (bg.color) root.style.setProperty('--color-background', bg.color);
    else if (theme.backgroundColor) root.style.setProperty('--color-background', theme.backgroundColor as any);
    // expose rgb triplet for components that use rgba(var(--background-secondary-color-rgb), var(--background-opacity))
    root.style.setProperty('--background-color-rgb', rgbString(theme.backgroundColor as any));

    const bg2 = normalizeRgba(theme.backgroundSecondaryColor as any);
    if (bg2.color) root.style.setProperty('--color-background-secondary', bg2.color);
    else if (theme.backgroundSecondaryColor) root.style.setProperty('--color-background-secondary', theme.backgroundSecondaryColor as any);
    root.style.setProperty('--background-secondary-color-rgb', rgbString(theme.backgroundSecondaryColor as any));

    const border = normalizeRgba(theme.borderColor as any);
    if (border.color) root.style.setProperty('--color-border', border.color);
    else if (theme.borderColor) root.style.setProperty('--color-border', theme.borderColor as any);
    root.style.setProperty('--border-color-rgb', rgbString(theme.borderColor as any));

    // Module/role/catalog specific header variables to ensure grid headers follow theme
    const primary = normalizeRgba(theme.primaryColor as any);
    if (primary.color) root.style.setProperty('--color-primary', primary.color);
    if (primary.color) root.style.setProperty('--module-header-bg', primary.color);
    root.style.setProperty('--primary-color-rgb', rgbString(theme.primaryColor as any));
    if (theme.textPrimaryColor) root.style.setProperty('--module-header-text', theme.textPrimaryColor);

    const secondary = normalizeRgba(theme.secondaryColor as any);
    if (secondary.color) root.style.setProperty('--color-secondary', secondary.color);
    if (secondary.color) root.style.setProperty('--role-header-bg', secondary.color);
    root.style.setProperty('--secondary-color-rgb', rgbString(theme.secondaryColor as any));
    if (theme.textPrimaryColor) root.style.setProperty('--role-header-text', theme.textPrimaryColor);

    const tertiary = normalizeRgba(theme.tertiaryColor as any);
    if (tertiary.color) root.style.setProperty('--color-tertiary', tertiary.color);
    if (tertiary.color) root.style.setProperty('--catalog-header-bg', tertiary.color);
    root.style.setProperty('--tertiary-color-rgb', rgbString(theme.tertiaryColor as any));
    if (theme.textPrimaryColor) root.style.setProperty('--catalog-header-text', theme.textPrimaryColor);

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
    // If background alpha was present in the provided backgroundColor, prefer it.
    if (bg.alpha) {
      root.style.setProperty('--background-opacity', bg.alpha);
    } else if (theme.backgroundOpacity !== undefined && theme.backgroundOpacity !== null) {
      root.style.setProperty('--background-opacity', String(theme.backgroundOpacity));
    }

    // Input styles
    const inputBg = normalizeRgba(theme.inputBackgroundColor as any);
    if (inputBg.color) root.style.setProperty('--input-background-color', inputBg.color);
    else if (theme.inputBackgroundColor) root.style.setProperty('--input-background-color', theme.inputBackgroundColor as any);
    root.style.setProperty('--input-background-color-rgb', rgbString(theme.inputBackgroundColor as any));

    const inputBorder = normalizeRgba(theme.inputBorderColor as any);
    if (inputBorder.color) root.style.setProperty('--input-border-color', inputBorder.color);
    else if (theme.inputBorderColor) root.style.setProperty('--input-border-color', theme.inputBorderColor as any);
    root.style.setProperty('--input-border-color-rgb', rgbString(theme.inputBorderColor as any));
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
