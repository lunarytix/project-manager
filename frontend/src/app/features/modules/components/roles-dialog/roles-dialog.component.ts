import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { RoleService } from '../../../../core/services/role.service';
import { PermissionService } from '../../../../core/services/permission.service';
import { PermissionCatalogService } from '../../../../core/services/permission-catalog.service';

@Component({
  selector: 'app-roles-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCheckboxModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Permisos - {{ data.moduleName || 'Módulo' }}</h2>
    <mat-dialog-content>
      <p *ngIf="loading">Cargando...</p>
      <div *ngIf="!loading">
        <div *ngFor="let r of roles" class="role-row">
          <div class="role-header"><strong>{{ r.nombre }}</strong></div>
          <div class="role-flags">
            <mat-checkbox [(ngModel)]="perms[r.id].canRead">Leer</mat-checkbox>
            <mat-checkbox [(ngModel)]="perms[r.id].canCreate">Crear</mat-checkbox>
            <mat-checkbox [(ngModel)]="perms[r.id].canUpdate">Editar</mat-checkbox>
            <mat-checkbox [(ngModel)]="perms[r.id].canDelete">Eliminar</mat-checkbox>
          </div>
          <div class="role-catalogs" *ngIf="catalogs?.length">
            <small>Catálogos:</small>
                    <div *ngFor="let c of catalogs" class="catalog-row">
                      <label>
                        <input type="checkbox" [checked]="perms[r.id].catalogIds.includes(c.id)" (change)="toggleCatalog(r.id, c.id, $event)" /> {{ c.nombre }}
                      </label>
                      <button mat-icon-button aria-label="Editar catálogo" (click)="editCatalog(c.id)">
                        <mat-icon>edit</mat-icon>
                      </button>
                    </div>
          </div>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`.role-row{padding:8px 4px;border-top:1px solid #eee;margin-top:8px}.role-flags{display:flex;gap:12px;align-items:center}.catalog-row{display:inline-block;margin-right:8px}`]
})
export class RolesDialogComponent implements OnInit {
  roles: any[] = [];
  perms: Record<string, { canRead: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean; catalogIds: string[] }> = {};
  catalogs: any[] = [];
  loading = false;

  constructor(
    private roleService: RoleService,
    private permService: PermissionService,
    private catalogService: PermissionCatalogService,
    private dialogRef: MatDialogRef<RolesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { moduleId: string; moduleName?: string },
    private router: Router
  ) {}

  editCatalog(id?: string) {
    if (!id) return;
    this.dialogRef.close(false);
    this.router.navigate(['permission-catalogs', 'edit', id]);
  }

  ngOnInit(): void { this.load(); }

  private load() {
    if (!this.data.moduleId) return;
    this.loading = true;
    this.catalogService.getAll().subscribe({ next: cats => this.catalogs = cats, error: () => this.catalogs = [] });
      this.roleService.getAll().subscribe({ next: roles => {
      this.roles = roles;
      roles.forEach(r => {
        if (!r || !r.id) return;
        this.perms[r.id] = { canRead: false, canCreate: false, canUpdate: false, canDelete: false, catalogIds: [] };
      });
      this.permService.getByModule(this.data.moduleId).subscribe({ next: perms => {
        perms.forEach((p:any) => {
          if (p.role && p.role.id) {
            const rid = p.role.id;
            this.perms[rid] = { canRead: !!p.canRead, canCreate: !!p.canCreate, canUpdate: !!p.canUpdate, canDelete: !!p.canDelete, catalogIds: [] };
            if (p.id) {
              this.catalogService.getMappings(p.id).subscribe({ next: maps => { this.perms[rid].catalogIds = maps.map((m:any)=>m.catalog.id); }, error: () => {} });
            }
          }
        });
        this.loading = false;
      }, error: () => { this.loading = false; } });
    }, error: () => { this.roles = []; this.loading = false; } });
  }

  toggleCatalog(roleId: string, catalogId: string, ev: any) {
    if (!roleId) return;
    if (!this.perms[roleId]) this.perms[roleId] = { canRead: false, canCreate: false, canUpdate: false, canDelete: false, catalogIds: [] };
    const arr = this.perms[roleId].catalogIds || [];
    if (ev && ev.target && ev.target.checked) { if (!arr.includes(catalogId)) arr.push(catalogId); }
    else { const idx = arr.indexOf(catalogId); if (idx>=0) arr.splice(idx,1); }
    this.perms[roleId].catalogIds = arr;
  }

  onCancel() { this.dialogRef.close(false); }

  onSave() {
    if (!this.data.moduleId) return;
    this.loading = true;
    this.permService.getByModule(this.data.moduleId).subscribe({ next: perms => {
      const permByRole: Record<string, any> = {};
      perms.forEach((p:any) => { if (p.role && p.role.id) permByRole[p.role.id] = p; });
      const ops: Array<() => void> = [];
      this.roles.forEach((r:any) => {
        if (!r || !r.id) return;
        const state = this.perms[r.id] || { canRead: false, canCreate: false, canUpdate: false, canDelete: false, catalogIds: [] };
        const existing = permByRole[r.id];
        if (existing) {
          const body = { ...existing, canRead: !!state.canRead, canCreate: !!state.canCreate, canUpdate: !!state.canUpdate, canDelete: !!state.canDelete };
          ops.push(() => {
            this.permService.update(existing.id, body).subscribe({
              next: (saved: any) => {
                this.catalogService.getMappings(saved.id).subscribe({
                  next: (maps: any[]) => {
                    const existingCatalogIds = maps.map((m: any) => m.catalog.id);
                    const toAdd = state.catalogIds.filter((id: string) => !existingCatalogIds.includes(id));
                    const toRemove = existingCatalogIds.filter((id: string) => !state.catalogIds.includes(id));
                    if (toAdd.length) {
                      this.catalogService.addMappings(saved.id, toAdd).subscribe(() => {}, () => {});
                    }
                    toRemove.forEach((cid: string) => this.catalogService.removeMapping(saved.id, cid).subscribe(() => {}, () => {}));
                  },
                  error: () => {}
                });
              },
              error: () => { /* ignore */ }
            });
          });
        } else {
          const body: any = { roleId: r.id, moduleId: this.data.moduleId, canRead: !!state.canRead, canCreate: !!state.canCreate, canUpdate: !!state.canUpdate, canDelete: !!state.canDelete };
          ops.push(() => {
            this.permService.create(body).subscribe({
              next: (saved: any) => {
                if (state.catalogIds && state.catalogIds.length) {
                  this.catalogService.addMappings(saved.id, state.catalogIds).subscribe(() => {}, () => {});
                }
              },
              error: () => {}
            });
          });
        }
      });
      const run = (i:number) => { if (i>=ops.length) { this.loading=false; this.dialogRef.close(true); return; } try { ops[i](); } catch {} setTimeout(()=>run(i+1),120); };
      run(0);
    }, error: ()=> { this.loading=false; this.dialogRef.close(true); } });
  }
}
