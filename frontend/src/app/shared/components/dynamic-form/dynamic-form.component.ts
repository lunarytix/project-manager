import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Import all input components
import { InputTextComponent } from '../input-text/input-text.component';
import { InputPasswordComponent } from '../input-password/input-password.component';
import { InputSelectComponent, SelectOption } from '../input-select/input-select.component';
import { InputCheckboxComponent } from '../input-checkbox/input-checkbox.component';
import { InputNumberComponent } from '../input-number/input-number.component';
import { InputButtonComponent, ButtonVariant } from '../input-button/input-button.component';

export interface DynamicFormField {
  key: string;
  type: 'text' | 'select' | 'checkbox' | 'number' | 'date' | 'email' | 'password' | 'textarea';
  label?: string;
  placeholder?: string;
  value?: any;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  options?: SelectOption[];  // For select fields
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    email?: boolean;
  };
  className?: string;
  order?: number;
}

export interface DynamicFormConfig {
  fields: DynamicFormField[];
  submitButton?: {
    label: string;
    variant?: ButtonVariant;
    loading?: boolean;
  };
  resetButton?: {
    label: string;
    variant?: ButtonVariant;
  };
  layout?: 'vertical' | 'horizontal' | 'grid';
  gridColumns?: number;
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextComponent,
    InputPasswordComponent,
    InputSelectComponent,
    InputCheckboxComponent,
    InputNumberComponent,
    InputButtonComponent
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dynamic-form" [class]="getFormClasses()">

      <div class="form-fields" [class]="getFieldsContainerClass()">
        <div *ngFor="let field of sortedFields" class="form-field" [class]="field.className">

          <!-- Text Input -->
          <app-input-text
            *ngIf="field.type === 'text' || field.type === 'email'"
            [formControlName]="field.key"
            [label]="field.label || ''"
            [placeholder]="field.placeholder || ''"
            [disabled]="field.disabled || false"
            [readonly]="field.readonly || false"
            [error]="hasError(field.key)"
            [errorMessage]="getErrorMessage(field.key)"
            (valueChange)="onFieldChange(field.key, $event)">
          </app-input-text>

          <!-- Password Input -->
          <app-input-password
            *ngIf="field.type === 'password'"
            [formControlName]="field.key"
            [label]="field.label || ''"
            [placeholder]="field.placeholder || ''"
            [disabled]="field.disabled || false"
            [readonly]="field.readonly || false"
            [error]="hasError(field.key)"
            [errorMessage]="getErrorMessage(field.key)"
            (valueChange)="onFieldChange(field.key, $event)">
          </app-input-password>

          <!-- Number Input -->
          <app-input-number
            *ngIf="field.type === 'number'"
            [formControlName]="field.key"
            [label]="field.label || ''"
            [placeholder]="field.placeholder || ''"
            [disabled]="field.disabled || false"
            [readonly]="field.readonly || false"
            [min]="field.validation?.min || null"
            [max]="field.validation?.max || null"
            [error]="hasError(field.key)"
            [errorMessage]="getErrorMessage(field.key)"
            (valueChange)="onFieldChange(field.key, $event)">
          </app-input-number>

          <!-- Select Input -->
          <app-input-select
            *ngIf="field.type === 'select'"
            [formControlName]="field.key"
            [label]="field.label || ''"
            [placeholder]="field.placeholder || ''"
            [disabled]="field.disabled || false"
            [options]="field.options || []"
            [error]="hasError(field.key)"
            [errorMessage]="getErrorMessage(field.key)"
            (valueChange)="onFieldChange(field.key, $event)">
          </app-input-select>

          <!-- Checkbox Input -->
          <app-input-checkbox
            *ngIf="field.type === 'checkbox'"
            [formControlName]="field.key"
            [label]="field.label || ''"
            [disabled]="field.disabled || false"
            [error]="hasError(field.key)"
            [errorMessage]="getErrorMessage(field.key)"
            (valueChange)="onFieldChange(field.key, $event)">
          </app-input-checkbox>

          <!-- Date Input -->
          <app-input-text
            *ngIf="field.type === 'date'"
            [formControlName]="field.key"
            [label]="field.label || ''"
            [placeholder]="field.placeholder || ''"
            [disabled]="field.disabled || false"
            [readonly]="field.readonly || false"
            [error]="hasError(field.key)"
            [errorMessage]="getErrorMessage(field.key)"
            (valueChange)="onFieldChange(field.key, $event)">
          </app-input-text>

          <!-- Textarea -->
          <div *ngIf="field.type === 'textarea'" class="input-wrapper">
            <label *ngIf="field.label" class="input-label">{{ field.label }}</label>
            <textarea
              class="form-textarea"
              [class.error]="hasError(field.key)"
              [formControlName]="field.key"
              [placeholder]="field.placeholder || ''"
              [disabled]="field.disabled || false"
              [readonly]="field.readonly || false"
              rows="4"
              (input)="onFieldChange(field.key, $any($event.target).value)">
            </textarea>
            <span *ngIf="hasError(field.key)" class="error-message">{{ getErrorMessage(field.key) }}</span>
          </div>

        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions" *ngIf="config.submitButton || config.resetButton">
        <app-input-button
          *ngIf="config.resetButton"
          type="button"
          [variant]="config.resetButton.variant || 'secondary'"
          [outline]="true"
          (clicked)="onReset()">
          {{ config.resetButton.label }}
        </app-input-button>

        <app-input-button
          *ngIf="config.submitButton"
          type="submit"
          [variant]="config.submitButton.variant || 'primary'"
          [disabled]="form.invalid"
          [loading]="config.submitButton.loading || false">
          {{ config.submitButton.label }}
        </app-input-button>
      </div>

    </form>
  `,
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() config!: DynamicFormConfig;
  @Input() initialValues: { [key: string]: any } = {};
  @Output() formSubmit = new EventEmitter<{ [key: string]: any }>();
  @Output() formReset = new EventEmitter<void>();
  @Output() fieldChange = new EventEmitter<{ field: string, value: any, formValue: { [key: string]: any } }>();
  @Output() formChange = new EventEmitter<{ [key: string]: any }>();

  form!: FormGroup;
  sortedFields: DynamicFormField[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange) {
      this.buildForm();
    }
    if (changes['initialValues'] && !changes['initialValues'].firstChange) {
      this.setFormValues();
    }
  }

  private buildForm(): void {
    if (!this.config?.fields) return;

    const formControls: { [key: string]: any[] } = {};

    this.config.fields.forEach(field => {
      const validators = this.buildValidators(field);
      const initialValue = this.getInitialValue(field);

      formControls[field.key] = [
        { value: initialValue, disabled: field.disabled || false },
        validators
      ];
    });

    this.form = this.fb.group(formControls);
    this.sortedFields = this.config.fields.sort((a, b) => (a.order || 0) - (b.order || 0));

    // Watch form changes
    this.form.valueChanges.subscribe(value => {
      this.formChange.emit(value);
    });
  }

  private buildValidators(field: DynamicFormField): any[] {
    const validators: any[] = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.validation) {
      const val = field.validation;

      if (val.min !== undefined) validators.push(Validators.min(val.min));
      if (val.max !== undefined) validators.push(Validators.max(val.max));
      if (val.minLength !== undefined) validators.push(Validators.minLength(val.minLength));
      if (val.maxLength !== undefined) validators.push(Validators.maxLength(val.maxLength));
      if (val.pattern) validators.push(Validators.pattern(val.pattern));
      if (val.email) validators.push(Validators.email);
    }

    if (field.type === 'email') {
      validators.push(Validators.email);
    }

    return validators;
  }

  private getInitialValue(field: DynamicFormField): any {
    if (this.initialValues && this.initialValues[field.key] !== undefined) {
      return this.initialValues[field.key];
    }
    return field.value || (field.type === 'checkbox' ? false : '');
  }

  private setFormValues(): void {
    if (this.form && this.initialValues) {
      this.form.patchValue(this.initialValues);
    }
  }

  hasError(fieldKey: string): boolean {
    const field = this.form.get(fieldKey);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldKey: string): string {
    const field = this.form.get(fieldKey);
    if (!field || !field.errors) return '';

    const errors = field.errors;

    if (errors['required']) return 'Este campo es requerido';
    if (errors['email']) return 'Email no válido';
    if (errors['min']) return `Valor mínimo: ${errors['min'].min}`;
    if (errors['max']) return `Valor máximo: ${errors['max'].max}`;
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['pattern']) return 'Formato no válido';

    return 'Campo inválido';
  }

  onFieldChange(fieldKey: string, value: any): void {
    this.fieldChange.emit({
      field: fieldKey,
      value: value,
      formValue: this.form.value
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onReset(): void {
    this.form.reset();
    this.setFormValues();
    this.formReset.emit();
  }

  getFormClasses(): string {
    const classes = ['dynamic-form'];
    if (this.config.layout) {
      classes.push(`form-${this.config.layout}`);
    }
    return classes.join(' ');
  }

  getFieldsContainerClass(): string {
    const classes = ['form-fields'];
    if (this.config.layout === 'grid') {
      classes.push(`grid-cols-${this.config.gridColumns || 2}`);
    }
    return classes.join(' ');
  }

  // Public methods for external access
  getFormValue(): { [key: string]: any } {
    return this.form.value;
  }

  getFieldValue(fieldKey: string): any {
    return this.form.get(fieldKey)?.value;
  }

  setFieldValue(fieldKey: string, value: any): void {
    this.form.get(fieldKey)?.setValue(value);
  }

  resetForm(): void {
    this.onReset();
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  markAllAsTouched(): void {
    this.form.markAllAsTouched();
  }
}
