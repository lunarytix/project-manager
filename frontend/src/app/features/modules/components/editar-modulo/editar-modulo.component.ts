import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleService } from '../../../../core/services/module.service';
import { RoleService } from '../../../../core/services/role.service';
import { Role } from '../../../../core/models/role.model';

@Component({
  selector: 'app-editar-modulo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatSelectModule],
  templateUrl: './editar-modulo.component.html',
  styleUrls: ['./editar-modulo.component.scss']
})
export class EditarModuloComponent implements OnInit {
  form!: FormGroup;
  roles: Role[] = [];
  loading = false;
  submitting = false;
  moduleId: string | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private moduleService: ModuleService, private roleService: RoleService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: [''],
      descripcion: [''],
      icono: [''],
      ruta: [''],
      rolesPermitidos: [[]],
      activo: [true]
    });

    this.roleService.getAll().subscribe({ next: r => this.roles = r, error: () => this.roles = [] });
    this.moduleId = this.route.snapshot.paramMap.get('id');
    if (this.moduleId) this.loadModule(this.moduleId);
  }

  loadModule(id: string) {
    this.loading = true;
    this.moduleService.getById(id).subscribe({ next: m => { this.form.patchValue(m); this.loading = false; }, error: () => { this.error = 'Error cargando módulo'; this.loading = false; } });
  }

  toggleRole(roleId: string | undefined, checked: boolean): void {
    if (!roleId) return;
    const control = this.form.get('rolesPermitidos');
    if (control) {
      const value = control.value || [];
      if (checked) {
        if (!value.includes(roleId)) value.push(roleId);
      } else {
        const idx = value.indexOf(roleId);
        if (idx > -1) value.splice(idx, 1);
      }
      control.setValue(value);
    }
  }

  submit(): void {
    if (!this.moduleId) return;
    this.submitting = true;
    this.moduleService.update(this.moduleId, this.form.value).subscribe({ next: () => { this.submitting = false; this.router.navigate(['/modules/list']); }, error: (err) => { this.submitting = false; this.error = err?.error?.message || 'Error al actualizar'; } });
  }
}
