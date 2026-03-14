import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { RoleService } from '../../../../core/services/role.service';
import { Role } from '../../../../core/models/role.model';
import { DynamicFormComponent, DynamicFormConfig } from '../../../../shared/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss']
})
export class CrearUsuarioComponent implements OnInit {
  userFormConfig!: DynamicFormConfig;
  roles: Role[] = [];
  submitting = false;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.setupForm();
  }

  private loadRoles(): void {
    this.roleService.getAll().subscribe({ 
      next: roles => {
        this.roles = roles;
        this.updateFormConfig();
      }, 
      error: () => {
        this.roles = [];
        this.updateFormConfig();
      } 
    });
  }

  private setupForm(): void {
    this.userFormConfig = {
      fields: [
        {
          key: 'nombre',
          type: 'text',
          label: 'Nombre',
          placeholder: 'Ingresa el nombre completo',
          required: true,
          order: 1
        },
        {
          key: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'Ingresa el email',
          required: true,
          validation: { email: true },
          order: 2
        },
        {
          key: 'password',
          type: 'password',
          label: 'Contraseña',
          placeholder: 'Ingresa la contraseña',
          required: true,
          validation: { minLength: 6 },
          order: 3
        },
        {
          key: 'roleId',
          type: 'select',
          label: 'Rol',
          placeholder: '-- seleccionar --',
          required: true,
          options: [],
          order: 4
        },
        {
          key: 'activo',
          type: 'checkbox',
          label: 'Activo',
          value: true,
          order: 5
        }
      ],
      submitButton: {
        label: this.submitting ? 'Creando...' : 'Crear',
        variant: 'primary',
        loading: this.submitting
      },
      resetButton: {
        label: 'Cancelar',
        variant: 'secondary'
      },
      layout: 'vertical'
    };
  }

  private updateFormConfig(): void {
    if (this.userFormConfig) {
      const roleField = this.userFormConfig.fields.find(f => f.key === 'roleId');
      if (roleField) {
        roleField.options = this.roles.map(role => ({
          value: role.id || '',
          label: role.nombre
        }));
      }
    }
  }

  onFormSubmit(formValue: any): void {
    this.submitting = true;
    this.error = null;

    // Update button state
    if (this.userFormConfig.submitButton) {
      this.userFormConfig.submitButton.loading = true;
      this.userFormConfig.submitButton.label = 'Creando...';
    }

    this.userService.create(formValue).subscribe({
      next: () => {
        this.submitting = false;
        if (this.userFormConfig.submitButton) {
          this.userFormConfig.submitButton.loading = false;
        }
        this.router.navigate(['/users/list']);
      },
      error: (err) => {
        this.submitting = false;
        if (this.userFormConfig.submitButton) {
          this.userFormConfig.submitButton.loading = false;
          this.userFormConfig.submitButton.label = 'Crear';
        }
        this.error = err?.error?.message || 'Error al crear usuario';
      }
    });
  }

  onFormReset(): void {
    this.router.navigate(['/users/list']);
  }
}