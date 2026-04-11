import { Component, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ModuleService } from '../../core/services/module.service';
import { Subscription } from 'rxjs';
import { DynamicFormComponent, DynamicFormConfig } from '../components/dynamic-form/dynamic-form.component';
import { UserService } from '../../core/services/user.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule, DynamicFormComponent],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('editorCanvas') editorCanvas!: ElementRef<HTMLCanvasElement>;

  showMenu = false;
  showProfile = false;
  showProfileEdit = false;
  user: any = null;
  modules: any[] = [];
  profileFormConfig!: DynamicFormConfig;
  profileInitialValues: { [key: string]: any } = {};
  profileError: string | null = null;
  profileSuccess: string | null = null;
  profileSubmitting = false;
  profileUploading = false;
  showEditor = false;
  editorImage = new Image();
  editorZoom = 1;
  selectedImageDataUrl = '';
  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private location: Location,
    private auth: AuthService,
    private moduleService: ModuleService,
    private userService: UserService
  ) {
    this.user = this.auth.getCurrentUser();
    this.initProfileFormConfig();

    // subscribe to auth changes to update user and load modules when logged in
    const s = this.auth.authState$.subscribe((s) => {
      if (s && s.isAuthenticated) {
        this.user = s.usuario || this.auth.getCurrentUser();
        this.loadModules();
      } else {
        this.user = null;
        this.modules = [];
      }
    });
    this.subs.push(s);
  }

  toggleMenu() { this.showMenu = !this.showMenu; if (this.showMenu) this.showProfile = false; }
  toggleProfile() {
    this.showProfile = !this.showProfile;
    if (this.showProfile) {
      this.showMenu = false;
      this.showProfileEdit = false;
    }
  }

  goBack() { this.location.back(); this.showMenu = false; }
  goDashboard() { this.router.navigate(['/dashboard']); this.showMenu = false; }

  goSettings() {
    this.showProfileEdit = true;
    this.profileError = null;
    this.profileSuccess = null;
    this.loadCurrentUserProfile();
  }
  closeSettings() {
    this.showProfileEdit = false;
    this.profileError = null;
    this.profileSuccess = null;
  }

  logout() { this.auth.logout(); this.router.navigate(['/auth/login']); this.showProfile = false; }

  loadModules() {
    this.moduleService.getAll().subscribe({ next: (m) => { this.modules = m || []; }, error: () => { this.modules = []; } });
  }

  navigateTo(path: string) {
    if (!path) return;
    // ensure leading slash
    const p = path.startsWith('/') ? path : '/' + path;
    this.router.navigate([p]);
    this.showMenu = false;
  }

  private initProfileFormConfig(): void {
    this.profileFormConfig = {
      layout: 'grid',
      gridColumns: 2,
      submitButton: {
        label: 'Guardar cambios',
        variant: 'primary',
        loading: false
      },
      fields: [
        { key: 'nombre', label: 'Nombre', type: 'text', required: true, order: 1 },
        { key: 'email', label: 'Email', type: 'email', required: true, validation: { email: true }, order: 2 },
        { key: 'roleLabel', label: 'Rol', type: 'text', readonly: true, disabled: true, order: 3 },
        { key: 'activo', label: 'Activo', type: 'checkbox', order: 4 }
      ]
    };
  }

  private buildAssetUrl(photo?: string): string {
    if (!photo) return '';
    if (/^https?:\/\//i.test(photo)) return photo;
    const baseApi = environment.apiUrl.replace(/\/api\/?$/, '');
    return `${baseApi}${photo.startsWith('/') ? '' : '/'}${photo}`;
  }

  private loadCurrentUserProfile(): void {
    if (!this.user?.id) return;
    this.userService.getById(this.user.id).subscribe({
      next: (fullUser) => {
        this.profileInitialValues = {
          nombre: fullUser.nombre,
          email: fullUser.email,
          roleLabel: this.user?.roleName || fullUser.roleId || '',
          activo: fullUser.activo
        };
        this.user = {
          ...this.user,
          ...fullUser,
          photo: this.buildAssetUrl(fullUser.photo)
        };
      },
      error: (err) => {
        this.profileError = err?.error?.message || 'No se pudo cargar el perfil';
      }
    });
  }

  onProfileFormSubmit(formData: any): void {
    if (!this.user?.id) return;
    this.profileSubmitting = true;
    this.profileSuccess = null;
    this.profileError = null;

    if (this.profileFormConfig.submitButton) {
      this.profileFormConfig.submitButton.loading = true;
      this.profileFormConfig.submitButton.label = 'Guardando...';
    }

    const payload = {
      nombre: formData.nombre,
      email: formData.email,
      activo: formData.activo
    };

    this.userService.updateProfile(this.user.id, payload).subscribe({
      next: (updatedUser) => {
        this.user = {
          ...this.user,
          ...updatedUser,
          photo: this.buildAssetUrl(updatedUser.photo)
        };
        this.auth.updateCurrentUser({
          nombre: updatedUser.nombre,
          email: updatedUser.email,
          activo: updatedUser.activo,
          photo: this.user.photo
        });
        this.profileSuccess = 'Perfil actualizado correctamente';
        this.profileSubmitting = false;
        if (this.profileFormConfig.submitButton) {
          this.profileFormConfig.submitButton.loading = false;
          this.profileFormConfig.submitButton.label = 'Guardar cambios';
        }
      },
      error: (err) => {
        this.profileError = err?.error?.message || 'No se pudo actualizar el perfil';
        this.profileSubmitting = false;
        if (this.profileFormConfig.submitButton) {
          this.profileFormConfig.submitButton.loading = false;
          this.profileFormConfig.submitButton.label = 'Guardar cambios';
        }
      }
    });
  }

  openImageSelector(): void {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    const choice = (window.prompt('Escribe "cambiar" para subir la imagen o "editar" para recortarla antes de guardar.', 'cambiar') || '').trim().toLowerCase();
    if (choice === 'editar') {
      this.openEditor(file);
    } else {
      this.uploadPhoto(file);
    }
    input.value = '';
  }

  private openEditor(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImageDataUrl = String(reader.result || '');
      this.editorImage = new Image();
      this.editorImage.onload = () => {
        this.editorZoom = 1;
        this.showEditor = true;
        setTimeout(() => this.drawEditorCanvas(), 0);
      };
      this.editorImage.src = this.selectedImageDataUrl;
    };
    reader.readAsDataURL(file);
  }

  onZoomChange(value: string): void {
    this.editorZoom = Number(value);
    this.drawEditorCanvas();
  }

  private drawEditorCanvas(): void {
    if (!this.editorCanvas || !this.editorImage?.width || !this.editorImage?.height) return;
    const canvas = this.editorCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const sourceSize = Math.min(this.editorImage.width, this.editorImage.height) / this.editorZoom;
    const sx = (this.editorImage.width - sourceSize) / 2;
    const sy = (this.editorImage.height - sourceSize) / 2;

    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(this.editorImage, sx, sy, sourceSize, sourceSize, 0, 0, size, size);
  }

  cancelEditImage(): void {
    this.showEditor = false;
    this.selectedImageDataUrl = '';
  }

  applyEditedImage(): void {
    if (!this.editorCanvas || !this.user?.id) return;
    this.editorCanvas.nativeElement.toBlob((blob) => {
      if (!blob) return;
      const editedFile = new File([blob], `profile-edited-${Date.now()}.png`, { type: 'image/png' });
      this.uploadPhoto(editedFile);
      this.cancelEditImage();
    }, 'image/png', 0.95);
  }

  private uploadPhoto(file: File): void {
    if (!this.user?.id) return;
    this.profileUploading = true;
    this.profileSuccess = null;
    this.profileError = null;

    this.userService.uploadProfilePhoto(this.user.id, file).subscribe({
      next: (response) => {
        const photoUrl = this.buildAssetUrl(response.photo);
        this.user = { ...this.user, photo: photoUrl };
        this.auth.updateCurrentUser({ photo: photoUrl });
        this.profileUploading = false;
        this.profileSuccess = 'Imagen de perfil actualizada';
      },
      error: (err) => {
        this.profileUploading = false;
        this.profileError = err?.error?.message || 'No se pudo subir la imagen';
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(): void {
    if (this.showMenu || this.showProfile) {
      this.showMenu = false;
      this.showProfile = false;
      this.showProfileEdit = false;
      this.showEditor = false;
    }
  }
}
