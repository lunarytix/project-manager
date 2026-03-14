import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { RoleService } from '../../../../core/services/role.service';
import { Role } from '../../../../core/models/role.model';
import { DynamicFormComponent, DynamicFormConfig } from '../../../../shared/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,  
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
  userFormConfig!: DynamicFormConfig;
  roles: Role[] = [];
  loading = false;
  submitting = false;
  error: string | null = null;
  userId: string | null = null;
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.loadRoles();
    this.setupForm();
    
    if (this.userId) {
      this.loadUser(this.userId);
    }
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

  private loadUser(userId: string): void {
    this.loading = true;
    this.userService.getById(userId).subscribe({
      next: user => {
        this.currentUser = user;
        this.updateInitialValues();
        this.loading = false;
      },
      error: () => {
        this.error = 'Error cargando usuario';
        this.loading = false;
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
          key: 'roleId',
          type: 'select',
          label: 'Rol',
          placeholder: '-- seleccionar --',
          required: true,
          options: [],
          order: 3
        },
        {
          key: 'activo',
          type: 'checkbox',
          label: 'Activo',
          value: true,
          order: 4
        }
      ],
      submitButton: {
        label: this.submitting ? 'Guardando...' : 'Guardar',
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

  private updateInitialValues(): void {
    if (this.currentUser && this.userFormConfig) {
      // Set initial values for the form
      this.userFormConfig.fields.forEach(field => {
        if (this.currentUser[field.key] !== undefined) {
          field.value = this.currentUser[field.key];
        }
      });
    }
  }

  onFormSubmit(formValue: any): void {
    if (!this.userId) return;

    this.submitting = true;
    this.error = null;

    // Update button state
    if (this.userFormConfig.submitButton) {
      this.userFormConfig.submitButton.loading = true;
      this.userFormConfig.submitButton.label = 'Guardando...';
    }

    this.userService.update(this.userId, formValue).subscribe({
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
          this.userFormConfig.submitButton.label = 'Guardar';
        }
        this.error = err?.error?.message || 'Error al actualizar usuario';
      }
    });
  }

  onFormReset(): void {
    this.router.navigate(['/users/list']);
  }
}