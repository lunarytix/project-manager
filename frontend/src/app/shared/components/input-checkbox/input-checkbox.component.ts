import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-wrapper">
      <label class="checkbox-container" [class.disabled]="disabled">
        <input 
          type="checkbox"
          class="checkbox-input"
          [checked]="value"
          [disabled]="disabled"
          (change)="onCheckboxChange($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
        />
        <span class="checkbox-custom"></span>
        <span class="checkbox-label" *ngIf="label">{{ label }}</span>
      </label>
      <span *ngIf="error" class="error-message">{{ errorMessage }}</span>
    </div>
  `,
  styleUrls: ['./input-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCheckboxComponent),
      multi: true
    }
  ]
})
export class InputCheckboxComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() error: boolean = false;
  @Input() errorMessage: string = '';
  @Input() indeterminate: boolean = false;
  @Input() checked: boolean = false; // Add checked property
  @Output() valueChange = new EventEmitter<boolean>();
  @Output() checkedChange = new EventEmitter<boolean>(); // Add checkedChange
  @Output() focused = new EventEmitter<void>();
  @Output() blurred = new EventEmitter<void>();

  value: boolean = false;
  onChange = (value: boolean) => {};
  onTouched = () => {};

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.checked;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.checkedChange.emit(this.value);
  }

  onFocus(): void {
    this.focused.emit();
  }

  onBlur(): void {
    this.onTouched();
    this.blurred.emit();
  }

  writeValue(value: boolean): void {
    this.value = !!value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}