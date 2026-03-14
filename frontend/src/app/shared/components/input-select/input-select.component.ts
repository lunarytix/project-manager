import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-input-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-wrapper">
      <label *ngIf="label" class="input-label">{{ label }}</label>
      <div class="select-container" [class.error]="error">
        <select 
          class="form-select"
          [disabled]="disabled"
          [value]="value"
          (change)="onSelectionChange($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        >
          <option value="" *ngIf="placeholder" disabled>{{ placeholder }}</option>
          <option 
            *ngFor="let option of options" 
            [value]="option.value"
            [disabled]="option.disabled"
          >
            {{ option.label }}
          </option>
        </select>
        <div class="select-arrow"></div>
      </div>
      <span *ngIf="error" class="error-message">{{ errorMessage }}</span>
    </div>
  `,
  styleUrls: ['./input-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelectComponent),
      multi: true
    }
  ]
})
export class InputSelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Seleccionar...';
  @Input() disabled: boolean = false;
  @Input() error: boolean = false;
  @Input() errorMessage: string = '';
  @Input() options: SelectOption[] = [];
  @Input() multiple: boolean = false;
  @Output() valueChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<SelectOption>();
  @Output() focused = new EventEmitter<void>();
  @Output() blurred = new EventEmitter<void>();

  value: any = '';
  onChange = (value: any) => {};
  onTouched = () => {};

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    
    const selectedOption = this.options.find(opt => opt.value === this.value);
    if (selectedOption) {
      this.selectionChange.emit(selectedOption);
    }
  }

  onFocus(): void {
    this.focused.emit();
  }

  onBlur(): void {
    this.onTouched();
    this.blurred.emit();
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}