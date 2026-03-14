import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionDropdownComponent, ActionItem } from '../action-dropdown/action-dropdown.component';

export interface GridConfig {
  showIcon?: boolean;
  iconName?: string;
  iconColor?: string;
  cardHeaderClass?: string;
  gridColumns?: string; // CSS value like "repeat(auto-fill, minmax(300px, 1fr))"
  gap?: string;
}

export interface GridItem {
  id: string;
  name: string;
  description?: string;
  status?: boolean;
  statusText?: string;
  icon?: string;
  [key: string]: any; // Allow additional properties
}

@Component({
  selector: 'app-standard-grid',
  standalone: true,
  imports: [CommonModule, ActionDropdownComponent],
  template: `
    <div class="standard-grid" [ngStyle]="getGridStyles()">
      <div *ngFor="let item of items; trackBy: trackByItem" class="grid-card">
        <div class="card-header" [ngClass]="config?.cardHeaderClass || 'default-header'">
          <div class="header-left">
            <div class="item-icon" *ngIf="config?.showIcon">
              <span class="material-icons" [ngStyle]="{'color': config?.iconColor}">
                {{ item.icon || config?.iconName || 'extension' }}
              </span>
            </div>
            <div class="item-main-info">
              <h4 class="item-name">{{ item.name }}</h4>
              <p class="item-description">{{ item.description || 'Sin descripción' }}</p>
            </div>
          </div>
          <div class="header-right">
            <div class="item-status" *ngIf="item.status !== undefined" [class.active]="item.status">
              <span class="status-dot"></span>
              <span class="status-text">{{ item.statusText || (item.status ? 'Activo' : 'Inactivo') }}</span>
            </div>
          </div>
        </div>
        
        <div class="card-body">
          <!-- Default content slot -->
          <ng-container *ngTemplateOutlet="bodyTemplate || null; context: { $implicit: item }"></ng-container>
          
          <!-- Fallback default body if no template provided -->
          <div *ngIf="!bodyTemplate" class="default-body">
            <div class="detail-item">
              <span class="detail-label">ID:</span>
              <span class="detail-value">{{ item.id }}</span>
            </div>
          </div>
        </div>

        <div class="card-actions">
          <button 
            *ngIf="showEditButton" 
            type="button" 
            class="btn btn-sm btn-outline" 
            (click)="onEdit(item)" 
            title="Editar">
            <span class="material-icons">edit</span>
          </button>
          
          <app-action-dropdown
            *ngIf="actionDropdownConfig"
            [config]="actionDropdownConfig"
            [actions]="getItemActions(item)"
            (actionClick)="onAction($event, item)">
          </app-action-dropdown>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./standard-grid.component.scss']
})
export class StandardGridComponent {
  @Input() items: GridItem[] = [];
  @Input() config?: GridConfig;
  @Input() actionDropdownConfig?: any;
  @Input() showEditButton = true;
  @Input() actionsProvider?: (item: GridItem) => ActionItem[];
  
  @ContentChild('bodyTemplate') bodyTemplate?: TemplateRef<any>;
  
  @Output() edit = new EventEmitter<GridItem>();
  @Output() action = new EventEmitter<{ action: ActionItem, item: GridItem }>();

  trackByItem(index: number, item: GridItem): string {
    return item.id || index.toString();
  }

  getGridStyles(): { [key: string]: string } {
    return {
      'grid-template-columns': this.config?.gridColumns || 'repeat(auto-fill, minmax(320px, 1fr))',
      'gap': this.config?.gap || '1.5rem'
    };
  }

  getItemActions(item: GridItem): ActionItem[] {
    return this.actionsProvider ? this.actionsProvider(item) : [];
  }

  onEdit(item: GridItem): void {
    this.edit.emit(item);
  }

  onAction(action: ActionItem, item: GridItem): void {
    this.action.emit({ action, item });
  }
}