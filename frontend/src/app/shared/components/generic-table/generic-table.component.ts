import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgSelectModule } from '@ng-select/ng-select';

export type TableColumn = { 
  key: string; 
  label: string; 
  format?: 'text' | 'bool' | 'icon';
  sortable?: boolean;
  type?: 'text' | 'boolean' | 'number' | 'date';
};

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatIconModule, MatFormFieldModule, MatButtonModule, NgSelectModule],
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() pageSize = 10;
  @Input() enableSearch = true;
  @Input() canEdit = false;
  @Input() canDelete = false;
  @Input() extraActions: Array<{ key: string; label: string; icon?: string }> = [];
  // When true, render actions as a Material `mat-select` showing icons in options.
  @Input() useMatSelect = true;
  // Use ng-select (templated, select2-like) when true
  @Input() useNgSelect = false;
  // If true, render a native <select> (legacy / lightweight) for actions
  @Input() useNativeSelect = false;
  // If true, use the icon stored in each row (row[rowIconKey]) as the action icon
  @Input() useRowIconForActions = false;
  // field name in the row that stores the icon name (default 'icono')
  @Input() rowIconKey: string = 'icono';

  // track per-row selection to reset after user picks an action
  selection: Record<string, string> = {};

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() action = new EventEmitter<{ key: string; row: any }>();

  searchTerm = '';
  currentPage = 1;

  get filtered() {
    if (!this.searchTerm) return this.data || [];
    const q = this.searchTerm.toLowerCase();
    return (this.data || []).filter(r => {
      return this.columns.some(c => {
        const v = r[c.key];
        return v != null && String(v).toLowerCase().includes(q);
      });
    });
  }

  get paged() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  goto(page: number) {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;
  }

  getPages(): any[] {
    return Array.from({ length: this.totalPages });
  }

  onEdit(row: any) { this.edit.emit(row); }
  onDelete(row: any) { this.delete.emit(row); }
  onAction(key: string, row: any) { this.action.emit({ key, row }); }

  // handle selection from mat-select (value is 'edit'|'delete'|'extra:<key>')
  onSelectAction(value: string, row: any) {
    if (!value) return;
    if (value === 'edit') this.onEdit(row);
    else if (value === 'delete') this.onDelete(row);
    else if (value.startsWith('extra:')) this.onAction(value.substring('extra:'.length), row);
    // reset selection for this row
    const id = row && (row.id || row._id || JSON.stringify(row));
    if (id) {
      // small delay to let UI update
      setTimeout(() => { try { this.selection[id] = ''; } catch { /* ignore */ } }, 0);
    }
  }
  
  // Build action items for dropdowns
  getActionItems(row: any) {
    const items: Array<{ value: string; label: string; icon?: string }> = [];
    (this.extraActions || []).forEach(a => items.push({ value: 'extra:' + a.key, label: a.label, icon: a.icon }));
    if (this.canEdit) items.push({ value: 'edit', label: 'Editar', icon: 'edit' });
    if (this.canDelete) items.push({ value: 'delete', label: 'Eliminar', icon: 'delete' });
    return items;
  }

  // Build all actions as buttons (dynamic)
  getAllActions(row: any) {
    const actions: Array<{ key: string; label: string; icon: string; type: 'extra' | 'edit' | 'delete'; cssClass: string }> = [];
    
    // Add extra actions
    (this.extraActions || []).forEach(a => {
      actions.push({
        key: a.key,
        label: a.label,
        icon: this.useRowIconForActions ? (row[this.rowIconKey] || a.icon || 'more_vert') : (a.icon || 'more_vert'),
        type: 'extra',
        cssClass: 'extra-action'
      });
    });

    // Add edit action
    if (this.canEdit) {
      actions.push({
        key: 'edit',
        label: 'Editar',
        icon: this.useRowIconForActions ? (row[this.rowIconKey] || 'edit') : 'edit',
        type: 'edit',
        cssClass: 'edit-action'
      });
    }

    // Add delete action
    if (this.canDelete) {
      actions.push({
        key: 'delete',
        label: 'Eliminar',
        icon: this.useRowIconForActions ? (row[this.rowIconKey] || 'delete') : 'delete',
        type: 'delete',
        cssClass: 'delete-action'
      });
    }

    return actions;
  }

  // Handle dynamic action clicks
  onDynamicAction(action: any, row: any) {
    switch (action.type) {
      case 'edit':
        this.onEdit(row);
        break;
      case 'delete':
        this.onDelete(row);
        break;
      case 'extra':
        this.onAction(action.key, row);
        break;
    }
  }
  
}
