import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Appearance } from '../../../../core/models/appearance.model';
import { AppearanceService } from '../../../../core/services/appearance.service';

@Component({
  selector: 'app-appearance-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appearance-list.component.html',
  styleUrls: ['./appearance-list.component.scss']
})
export class AppearanceListComponent implements OnInit {
  themes: Appearance[] = [];
  loading = false;
  currentTheme: Appearance | null = null;
  isPreviewMode = false;
  previewTheme: Appearance | null = null;

  constructor(
    private appearanceService: AppearanceService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.loadThemes();
    this.appearanceService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  loadThemes(): void {
    this.loading = true;
    this.appearanceService.getAll().subscribe({
      next: (themes) => {
        this.themes = themes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading themes:', error);
        this.loading = false;
      }
    });
  }

  applyTheme(theme: Appearance): void {
    this.loading = true;
    this.appearanceService.setAsDefault(theme.id).subscribe({
      next: (updatedTheme) => {
        this.loadThemes(); // Refresh to show updated default status
        this.isPreviewMode = false;
        this.previewTheme = null;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error applying theme:', error);
        this.loading = false;
      }
    });
  }

  editTheme(theme: Appearance): void {
    this.router.navigate(['/appearance/edit', theme.id]);
  }

  deleteTheme(theme: Appearance): void {
    if (theme.isDefault) {
      alert('No se puede eliminar el tema por defecto');
      return;
    }

    if (confirm(`¿Está seguro de que desea eliminar el tema "${theme.name}"?`)) {
      this.loading = true;
      this.appearanceService.delete(theme.id).subscribe({
        next: () => {
          this.loadThemes();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting theme:', error);
          alert('Error al eliminar el tema');
          this.loading = false;
        }
      });
    }
  }

  startPreview(theme: Appearance): void {
    this.previewTheme = theme;
    this.isPreviewMode = true;
    this.appearanceService.applyTheme(theme);
  }

  cancelPreview(): void {
    if (this.isPreviewMode && this.currentTheme) {
      this.appearanceService.applyTheme(this.currentTheme);
      this.isPreviewMode = false;
      this.previewTheme = null;
    }
  }

  getDefaultTheme(): Appearance | null {
    return this.themes.find(t => t.isDefault) || null;
  }

  createNew(): void {
    this.router.navigate(['/appearance/create']);
  }
}