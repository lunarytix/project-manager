import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { BaseDynamicPermissionsComponent } from '../../../../core/components/base-dynamic-permissions.component';
import { GenericTableComponent, TableColumn } from '../../../../shared/components/generic-table/generic-table.component';

@Component({
  selector: 'app-listar-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule, GenericTableComponent],
  templateUrl: './listar-usuario.component.html',
  styleUrls: ['./listar-usuario.component.scss']
})
export class ListarUsuarioComponent extends BaseDynamicPermissionsComponent {
  usuarios: User[] = [];
  loading = false;
  error: string | null = null;
  
  cols: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'roleId', label: 'Rol' },
    { key: 'activo', label: 'Activo', format: 'bool' }
  ];

  constructor(private userService: UserService) {
    super();
  }

  protected onComponentInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (data) => { 
        this.usuarios = data; 
        this.loading = false; 
      },
      error: (err) => { 
        this.error = err?.message || 'Error al cargar usuarios'; 
        this.loading = false; 
      }
    });
  }

  onCreate(): void {
    this.navigateToCreate();
  }

  onEdit(id?: string): void {
    if (!id) return;
    this.navigateToEdit(id);
  }

  onDelete(id?: string): void {
    if (!id) return;
    if (!confirm('¿Confirmar eliminación del usuario?')) return;
    this.userService.delete(id).subscribe({
      next: () => this.loadUsers(),
      error: () => alert('Error al eliminar')
    });
  }
}
