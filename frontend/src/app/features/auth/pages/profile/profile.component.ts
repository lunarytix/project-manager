import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DynamicFormComponent, DynamicFormConfig } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('editorCanvas') editorCanvas!: ElementRef<HTMLCanvasElement>;

  profileFormConfig!: DynamicFormConfig;
  formInitialValues: { [key: string]: any } = {};
  currentUserId = '';
  roleName = '';
  profilePhoto = '';

  submitting = false;
  uploading = false;
  error: string | null = null;
  success: string | null = null;

  // Lightweight image editor state
  showEditor = false;
  editorImage = new Image();
  editorZoom = 1;
  selectedImageDataUrl = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const authUser = this.authService.getCurrentUser();
    if (!authUser?.id) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.currentUserId = authUser.id;
    this.profilePhoto = authUser.photo || '';
    this.buildForm();
    this.loadCurrentUser();
  }

  private buildAssetUrl(photo?: string): string {
    if (!photo) return '';
    if (/^https?:\/\//i.test(photo)) return photo;
    const baseApi = environment.apiUrl.replace(/\/api\/?$/, '');
    return `${baseApi}${photo.startsWith('/') ? '' : '/'}${photo}`;
  }

  private buildForm(): void {
    this.profileFormConfig = {
      layout: 'grid',
      gridColumns: 2,
      submitButton: {
        label: this.submitting ? 'Guardando...' : 'Guardar cambios',
        variant: 'primary',
        loading: this.submitting
      },
      fields: [
        {
          key: 'nombre',
          label: 'Nombre',
          type: 'text',
          required: true,
          order: 1
        },
        {
          key: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          validation: { email: true },
          order: 2
        },
        {
          key: 'roleLabel',
          label: 'Rol',
          type: 'text',
          readonly: true,
          disabled: true,
          order: 3
        },
        {
          key: 'activo',
          label: 'Activo',
          type: 'checkbox',
          order: 4
        }
      ]
    };
  }

  private loadCurrentUser(): void {
    this.userService.getById(this.currentUserId).subscribe({
      next: (user) => {
        this.roleName = user.roleId || '';
        this.profilePhoto = this.buildAssetUrl(user.photo) || this.profilePhoto;
        this.formInitialValues = {
          nombre: user.nombre,
          email: user.email,
          roleLabel: this.roleName,
          activo: user.activo
        };
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo cargar el perfil';
      }
    });
  }

  onFormSubmit(formData: any): void {
    this.submitting = true;
    this.success = null;
    this.error = null;
    if (this.profileFormConfig.submitButton) {
      this.profileFormConfig.submitButton.loading = true;
      this.profileFormConfig.submitButton.label = 'Guardando...';
    }

    const payload = {
      nombre: formData.nombre,
      email: formData.email,
      activo: formData.activo
    };

    this.userService.updateProfile(this.currentUserId, payload).subscribe({
      next: (updatedUser) => {
        this.authService.updateCurrentUser({
          nombre: updatedUser.nombre,
          email: updatedUser.email,
          activo: updatedUser.activo,
          photo: updatedUser.photo
        });
        this.success = 'Perfil actualizado correctamente';
        this.submitting = false;
        if (this.profileFormConfig.submitButton) {
          this.profileFormConfig.submitButton.loading = false;
          this.profileFormConfig.submitButton.label = 'Guardar cambios';
        }
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo actualizar el perfil';
        this.submitting = false;
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
    if (!this.editorCanvas) return;
    this.editorCanvas.nativeElement.toBlob((blob) => {
      if (!blob) return;
      const editedFile = new File([blob], `profile-edited-${Date.now()}.png`, { type: 'image/png' });
      this.uploadPhoto(editedFile);
      this.cancelEditImage();
    }, 'image/png', 0.95);
  }

  private uploadPhoto(file: File): void {
    this.uploading = true;
    this.error = null;
    this.success = null;

    this.userService.uploadProfilePhoto(this.currentUserId, file).subscribe({
      next: (response) => {
        const photoUrl = this.buildAssetUrl(response.photo);
        this.profilePhoto = photoUrl;
        this.authService.updateCurrentUser({ photo: photoUrl });
        this.uploading = false;
        this.success = 'Imagen de perfil actualizada';
      },
      error: (err) => {
        this.uploading = false;
        this.error = err?.error?.message || 'No se pudo subir la imagen';
      }
    });
  }
}
