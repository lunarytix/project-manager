import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionDropdownComponent, ActionItem } from '../action-dropdown/action-dropdown.component';
import { FrontendAuditService } from '../../../core/services/frontend-audit.service';

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
  iconColor?: string; // Optional per-item icon color
}

@Component({
  selector: 'app-standard-grid',
  standalone: true,
  imports: [CommonModule, ActionDropdownComponent],
  templateUrl: './standard-grid.component.html',
  styleUrls: ['./standard-grid.component.scss']
})
export class StandardGridComponent {
  constructor(private readonly frontendAudit: FrontendAuditService) {}

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
    this.frontendAudit.logAction('Click editar en card de grid', {
      itemId: item.id,
      itemName: item.name,
    }, 'StandardGridComponent');
    this.edit.emit(item);
  }

  onAction(action: ActionItem, item: GridItem): void {
    this.frontendAudit.logAction('Click accion en card de grid', {
      actionKey: action.key,
      actionLabel: action.label,
      itemId: item.id,
      itemName: item.name,
    }, 'StandardGridComponent');
    this.action.emit({ action, item });
  }

  /**
   * Devuelve estilos CSS (variables) para cada tarjeta.
   * Prioriza valores de `config` y `item` pero usa la variable CSS cuando sea apropiado.
   */
  getCardStyle(item: GridItem): { [key: string]: string } {
    const styles: { [key: string]: string } = {};

    const iconColor = this.config?.iconColor || item?.iconColor;
    if (iconColor) {
      // if it's a CSS variable reference, keep as-is, otherwise set direct color value
      styles['--icon-color'] = iconColor;
    }

    // Allow card header custom class to optionally define header-related vars via CSS.
    // If item provides a headerBgColor we expose it as a CSS var for theming.
    const headerBg = (item as any).headerBgColor || (this.config as any)?.headerBgColor;
    if (headerBg) {
      styles['--module-header-bg'] = headerBg;
    }

    return styles;
  }
}
