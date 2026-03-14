import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-input-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type"
      class="btn"
      [class]="getButtonClasses()"
      [disabled]="disabled"
      (click)="onClick($event)"
    >
      <span *ngIf="loading" class="btn-spinner"></span>
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./input-button.component.scss']
})
export class InputButtonComponent {
  @Input() type: ButtonType = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() outline: boolean = false;
  @Output() clicked = new EventEmitter<Event>();

  onClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }

  getButtonClasses(): string {
    const classes = ['btn'];
    classes.push(`btn-${this.variant}`);
    classes.push(`btn-${this.size}`);
    
    if (this.outline) {
      classes.push('btn-outline');
    }
    
    if (this.loading) {
      classes.push('btn-loading');
    }
    
    return classes.join(' ');
  }
}