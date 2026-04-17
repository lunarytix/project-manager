import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewToggleComponent, ViewMode, ViewToggleConfig } from '../view-toggle/view-toggle.component';
import { FrontendAuditService } from '../../../core/services/frontend-audit.service';

export interface SearchFilterConfig {
  placeholder?: string;
  showCreateButton?: boolean;
  createButtonText?: string;
  createButtonIcon?: string;
  showViewToggle?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  totalItems?: number;
}

@Component({
  selector: 'app-search-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, ViewToggleComponent],
  templateUrl: './search-filter-bar.component.html',
  styleUrls: ['./search-filter-bar.component.scss']
})
export class SearchFilterBarComponent {
  constructor(private readonly frontendAudit: FrontendAuditService) {}

  @Input() config: SearchFilterConfig = {};
  @Input() currentView: ViewMode = 'grid';
  @Input() viewConfig: ViewToggleConfig = { gridLabel: 'Grid', tableLabel: 'Table' };
  @Input() searchTerm: string = '';
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;

  @Output() searchChange = new EventEmitter<string>();
  @Output() viewChange = new EventEmitter<ViewMode>();
  @Output() createClick = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchChange.emit(term);
  }

  onViewChange(view: ViewMode): void {
    this.currentView = view;
    this.frontendAudit.logAction('Cambio de vista en barra de filtros', {
      view,
    }, 'SearchFilterBarComponent');
    this.viewChange.emit(view);
  }

  onCreateClick(): void {
    this.frontendAudit.logAction('Click en crear desde barra de filtros', {
      currentView: this.currentView,
    }, 'SearchFilterBarComponent');
    this.createClick.emit();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.safeTotalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.frontendAudit.logAction('Cambio de pagina desde barra de filtros', {
        page,
        totalPages: this.safeTotalPages,
      }, 'SearchFilterBarComponent');
      this.pageChange.emit(page);
    }
  }

  get safeTotalPages(): number {
    return Math.max(1, Number(this.totalPages) || 1);
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.safeTotalPages, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  get showPrevEllipsis(): boolean {
    return this.currentPage > 3;
  }

  get showNextEllipsis(): boolean {
    return this.currentPage < this.safeTotalPages - 2;
  }
}
