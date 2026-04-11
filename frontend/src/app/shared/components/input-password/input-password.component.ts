import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-wrapper">
      <label *ngIf="label" class="input-label">{{ label }}</label>
      <div class="password-field" [class.error]="error" [class.focused]="isFocused">
        <input
          [type]="showPassword ? 'text' : 'password'"
          class="form-input"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [value]="value"
          (input)="onInput($event)"
          (blur)="handleBlur()"
          (focus)="handleFocus()"
        />
        <button
          type="button"
          class="toggle-btn"
          (click)="toggleVisibility()"
          [attr.aria-label]="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          tabindex="-1">
          <span class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
        </button>
      </div>
      <span *ngIf="error" class="error-message">{{ errorMessage }}</span>
    </div>
  `,
  styleUrls: ['./input-password.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPasswordComponent),
      multi: true
    }
  ]
})
export class InputPasswordComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() error = false;
  @Input() errorMessage = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() focused = new EventEmitter<void>();
  @Output() blurred = new EventEmitter<void>();

  value = '';
  showPassword = false;
  isFocused = false;
  onChange = (value: string) => {};
  onTouched = () => {};

  toggleVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  handleFocus(): void {
    this.isFocused = true;
    this.focused.emit();
  }

  handleBlur(): void {
    this.isFocused = false;
    this.onTouched();
    this.blurred.emit();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
