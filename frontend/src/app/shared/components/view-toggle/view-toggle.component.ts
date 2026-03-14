import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ViewMode = 'grid' | 'table';

export interface ViewToggleConfig {
  gridLabel?: string;
  tableLabel?: string;
  defaultView?: ViewMode;
}

@Component({
  selector: 'app-view-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="view-toggle">
      <div class="toggle-tabs">
        <button 
          type="button"
          class="toggle-tab"
          [class.active]="currentView === 'grid'"
          (click)="switchView('grid')">
          <span class="material-icons">view_module</span>
          {{ config.gridLabel || 'Grid' }}
        </button>
        
        <button 
          type="button"
          class="toggle-tab"
          [class.active]="currentView === 'table'"
          (click)="switchView('table')">
          <span class="material-icons">table_view</span>
          {{ config.tableLabel || 'Tabla' }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./view-toggle.component.scss']
})
export class ViewToggleComponent {
  @Input() config: ViewToggleConfig = {};
  @Input() currentView: ViewMode = 'grid';
  @Output() viewChange = new EventEmitter<ViewMode>();

  switchView(view: ViewMode): void {
    if (this.currentView !== view) {
      this.currentView = view;
      this.viewChange.emit(view);
    }
  }
}