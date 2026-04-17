import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontendAuditService } from '../../../core/services/frontend-audit.service';

export interface ActionItem {
  key: string;
  label: string;
  icon?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
  disabled?: boolean;
  separator?: boolean;
  hidden?: boolean;
}

export interface ActionDropdownConfig {
  buttonText?: string;
  buttonIcon?: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  maxHeight?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}

@Component({
  selector: 'app-action-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-dropdown.component.html',
  styleUrls: ['./action-dropdown.component.scss']
})
export class ActionDropdownComponent {
  @Input() actions: ActionItem[] = [];
  @Input() config: ActionDropdownConfig = {};
  @Input() disabled = false;

  @Output() actionClick = new EventEmitter<ActionItem>();

  isOpen = false;
  searchTerm = '';

  constructor(
    private elementRef: ElementRef,
    private readonly frontendAudit: FrontendAuditService,
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.searchTerm = '';
      }
    }
  }

  onActionClick(action: ActionItem): void {
    if (!action.disabled) {
      this.frontendAudit.logAction('Seleccion de accion en dropdown', {
        actionKey: action.key,
        actionLabel: action.label,
      }, 'ActionDropdownComponent');
      this.actionClick.emit(action);
      this.isOpen = false;
    }
  }

  onSearchChange(term: string): void {
    this.searchTerm = term.toLowerCase();
  }

  get filteredActions(): ActionItem[] {
    return this.actions.filter(action => {
      if (action.hidden) return false;
      if (!this.searchTerm) return true;
      return action.label.toLowerCase().includes(this.searchTerm);
    });
  }

  get buttonVariantClass(): string {
    const variant = this.config.buttonVariant || 'outline';
    return `btn-${variant}`;
  }

  get dropdownPositionClass(): string {
    const position = this.config.position || 'bottom-left';
    return `dropdown-${position}`;
  }

  trackByKey(index: number, item: ActionItem): string {
    return item.key;
  }
}
