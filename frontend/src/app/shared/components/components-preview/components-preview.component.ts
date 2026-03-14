import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  DynamicFormComponent, 
  DynamicFormConfig, 
  InputButtonComponent,
  ButtonVariant
} from '../index';

@Component({
  selector: 'app-components-preview',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent, InputButtonComponent],
  template: `
    <div class="components-preview">
      <h3 class="preview-title">Vista Previa de Componentes</h3>
      
      <!-- Form Preview -->
      <div class="preview-section">
        <h4 class="section-title">Formulario Dinámico</h4>
        <app-dynamic-form
          [config]="sampleFormConfig"
          [initialValues]="sampleValues"
          (formSubmit)="onFormSubmit($event)"
          (fieldChange)="onFieldChange($event)">
        </app-dynamic-form>
      </div>
      
      <!-- Buttons Preview -->
      <div class="preview-section">
        <h4 class="section-title">Botones</h4>
        <div class="buttons-grid">
          <app-input-button 
            *ngFor="let variant of buttonVariants" 
            [variant]="variant"
            (clicked)="onButtonClick(variant)">
            {{ variant | titlecase }}
          </app-input-button>
          
          <app-input-button 
            variant="primary" 
            [outline]="true"
            (clicked)="onButtonClick('outline')">
            Outline
          </app-input-button>
          
          <app-input-button 
            variant="secondary" 
            [loading]="true">
            Loading
          </app-input-button>
        </div>
      </div>
      
      <!-- Current Form Values -->
      <div class="preview-section" *ngIf="currentFormValues">
        <h4 class="section-title">Valores Actuales del Formulario</h4>
        <pre class="form-values">{{ currentFormValues | json }}</pre>
      </div>
      
    </div>
  `,
  styleUrls: ['./components-preview.component.scss']
})
export class ComponentsPreviewComponent implements OnInit {
  
  buttonVariants: ButtonVariant[] = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
  
  currentFormValues: any = null;
  
  sampleFormConfig: DynamicFormConfig = {
    layout: 'grid',
    gridColumns: 2,
    fields: [
      {
        key: 'name',
        type: 'text',
        label: 'Nombre',
        placeholder: 'Ingresa tu nombre',
        required: true,
        order: 1,
        validation: {
          minLength: 2,
          maxLength: 50
        }
      },
      {
        key: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'correo@ejemplo.com',
        required: true,
        order: 2
      },
      {
        key: 'age',
        type: 'number',
        label: 'Edad',
        placeholder: '18',
        required: true,
        order: 3,
        validation: {
          min: 18,
          max: 100
        }
      },
      {
        key: 'country',
        type: 'select',
        label: 'País',
        placeholder: 'Selecciona tu país',
        required: true,
        order: 4,
        options: [
          { value: 'mx', label: 'México' },
          { value: 'us', label: 'Estados Unidos' },
          { value: 'ca', label: 'Canadá' },
          { value: 'es', label: 'España' },
          { value: 'ar', label: 'Argentina' }
        ]
      },
      {
        key: 'newsletter',
        type: 'checkbox',
        label: 'Suscribirse al newsletter',
        order: 5
      },
      {
        key: 'bio',
        type: 'textarea',
        label: 'Biografía',
        placeholder: 'Cuéntanos sobre ti...',
        order: 6,
        className: 'field-full',
        validation: {
          maxLength: 500
        }
      }
    ],
    submitButton: {
      label: 'Enviar Formulario',
      variant: 'primary'
    },
    resetButton: {
      label: 'Limpiar',
      variant: 'secondary'
    }
  };
  
  sampleValues = {
    name: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    age: 25,
    country: 'mx',
    newsletter: true,
    bio: 'Desarrollador apasionado por la tecnología.'
  };

  ngOnInit(): void {
    this.currentFormValues = { ...this.sampleValues };
  }

  onFormSubmit(formValue: any): void {
    console.log('Form submitted:', formValue);
    alert('Formulario enviado! Ver consola para detalles.');
  }

  onFieldChange(change: { field: string, value: any, formValue: any }): void {
    this.currentFormValues = { ...change.formValue };
  }

  onButtonClick(variant: string): void {
    console.log(`Button clicked: ${variant}`);
  }
}