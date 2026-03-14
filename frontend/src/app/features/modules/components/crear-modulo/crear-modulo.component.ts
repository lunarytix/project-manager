import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModuleService } from '../../../../core/services/module.service';
import { RoleService } from '../../../../core/services/role.service';
import { Role } from '../../../../core/models/role.model';
import { DynamicFormComponent, DynamicFormConfig } from '../../../../shared/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-crear-modulo',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './crear-modulo.component.html',
  styleUrls: ['./crear-modulo.component.scss']
})
export class CrearModuloComponent implements OnInit {
  moduleFormConfig!: DynamicFormConfig;
  roles: Role[] = [];
  selectedRoles: string[] = [];
  submitting = false;
  error: string | null = null;

  constructor(
    private moduleService: ModuleService, 
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
    this.moduleFormConfig = {
      fields: [
        {
          key: 'nombre',
          type: 'text',
          label: 'Nombre',
          placeholder: 'Ej: Dashboard',
          required: true,
          order: 1
        },
        {
          key: 'descripcion',
          type: 'textarea',
          label: 'Descripción',
          placeholder: 'Descripción del módulo',
          order: 2
        },
        {
          key: 'icono',
          type: 'text',
          label: 'Ícono',
          placeholder: 'Ej: dashboard',
          order: 3
        },
        {
          key: 'ruta',
          type: 'text',
          label: 'Ruta',
          placeholder: 'Ej: /dashboard',
          required: true,
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
    // Add roles as individual checkboxes - we'll handle this in the template
    // For now, we'll use rolesPermitidos as a text field or handle separately
  }

  onFormSubmit(formValue: any): void {
    this.submitting = true;
    this.error = null;

    // Include selected roles in module data
    const moduleData = {
      ...formValue,
      rolesPermitidos: this.selectedRoles
    };

    // Update button state
    if (this.moduleFormConfig.submitButton) {
      this.moduleFormConfig.submitButton.loading = true;
      this.moduleFormConfig.submitButton.label = 'Creando...';
    }

    this.moduleService.create(moduleData).subscribe({
      next: () => {
        this.submitting = false;
        if (this.moduleFormConfig.submitButton) {
          this.moduleFormConfig.submitButton.loading = false;
        }
        this.router.navigate(['/modules/list']);
      },
      error: (err) => {
        this.submitting = false;
        if (this.moduleFormConfig.submitButton) {
          this.moduleFormConfig.submitButton.loading = false;
          this.moduleFormConfig.submitButton.label = 'Crear';
        }
        this.error = err?.error?.message || 'Error al crear módulo';
      }
    });
  }

  onFormReset(): void {
    this.router.navigate(['/modules/list']);
  }

  // Helper methods for role management
  toggleRole(roleId: string | undefined, checked: boolean): void {
    if (!roleId) return;
    
    if (checked) {
      if (!this.selectedRoles.includes(roleId)) {
        this.selectedRoles.push(roleId);
      }
    } else {
      const index = this.selectedRoles.indexOf(roleId);
      if (index > -1) {
        this.selectedRoles.splice(index, 1);
      }
    }
  }

  isRoleSelected(roleId: string | undefined): boolean {
    return roleId ? this.selectedRoles.includes(roleId) : false;
  }
}