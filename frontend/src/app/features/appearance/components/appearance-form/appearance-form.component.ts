import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppearanceService } from '../../../../core/services/appearance.service';
import { Appearance } from '../../../../core/models/appearance.model';
import { ColorHarmonyGenerator, ColorSuggestion } from '../../../../core/utils/color-harmony.util';
import { ComponentsPreviewComponent } from '../../../../shared/components/components-preview/components-preview.component';

@Component({
  selector: 'app-appearance-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ComponentsPreviewComponent],
  templateUrl: './appearance-form.component.html',
  styleUrls: ['./appearance-form.component.scss']
})
export class AppearanceFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  themeId?: string;
  loading = false;
  saving = false;

  colorCategories = [
    {
      name: 'Colores Primarios',
      colors: [
        { key: 'primaryColor', label: 'Primario', default: '#3B82F6', min: undefined, max: undefined, step: undefined },
        { key: 'primaryDarkColor', label: 'Primario Oscuro', default: '#1E3A8A', min: undefined, max: undefined, step: undefined },
        { key: 'primaryLightColor', label: 'Primario Claro', default: '#BFDBFE', min: undefined, max: undefined, step: undefined }
      ]
    },
    {
      name: 'Colores Secundarios',
      colors: [
        { key: 'secondaryColor', label: 'Secundario', default: '#10B981', min: undefined, max: undefined, step: undefined },
        { key: 'secondaryDarkColor', label: 'Secundario Oscuro', default: '#064E3B', min: undefined, max: undefined, step: undefined },
        { key: 'secondaryLightColor', label: 'Secundario Claro', default: '#BBF7D0', min: undefined, max: undefined, step: undefined }
      ]
    },
    {
      name: 'Colores Terciarios',
      colors: [
        { key: 'tertiaryColor', label: 'Terciario', default: '#F59E0B', min: undefined, max: undefined, step: undefined },
        { key: 'tertiaryDarkColor', label: 'Terciario Oscuro', default: '#92400E', min: undefined, max: undefined, step: undefined },
        { key: 'tertiaryLightColor', label: 'Terciario Claro', default: '#FEF3C7', min: undefined, max: undefined, step: undefined }
      ]
    },
    {
      name: 'Colores de Fondo',
      colors: [
        { key: 'backgroundColor', label: 'Fondo Principal', default: '#FFFFFF', min: undefined, max: undefined, step: undefined },
        { key: 'backgroundSecondaryColor', label: 'Fondo Secundario', default: '#F8FAFC', min: undefined, max: undefined, step: undefined },
        { key: 'borderColor', label: 'Bordes', default: '#E2E8F0', min: undefined, max: undefined, step: undefined }
      ]
    },
    {
      name: 'Colores de Texto',
      colors: [
        { key: 'textPrimaryColor', label: 'Texto Principal', default: '#111827', min: undefined, max: undefined, step: undefined },
        { key: 'textSecondaryColor', label: 'Texto Secundario', default: '#6B7280', min: undefined, max: undefined, step: undefined },
        { key: 'textMutedColor', label: 'Texto Atenuado', default: '#9CA3AF', min: undefined, max: undefined, step: undefined }
      ]
    },
    {
      name: 'Colores de Estado',
      colors: [
        { key: 'dangerColor', label: 'Peligro', default: '#EF4444', min: undefined, max: undefined, step: undefined },
        { key: 'successColor', label: 'Éxito', default: '#22C55E', min: undefined, max: undefined, step: undefined },
        { key: 'warningColor', label: 'Advertencia', default: '#F59E0B', min: undefined, max: undefined, step: undefined },
        { key: 'infoColor', label: 'Información', default: '#3B82F6', min: undefined, max: undefined, step: undefined }
      ]
    },
    {
      name: 'Colores de Input',
      colors: [
        { key: 'inputBackgroundColor', label: 'Fondo de Input', default: '#FFFFFF', min: undefined, max: undefined, step: undefined },
        { key: 'inputBorderColor', label: 'Borde de Input', default: '#E2E8F0', min: undefined, max: undefined, step: undefined },
        { key: 'inputFocusColor', label: 'Foco de Input', default: '#3B82F6', min: undefined, max: undefined, step: undefined }
      ]
    }
  ];

  typographySettings = [
    {
      name: 'Fuente',
      fields: [
        {
          key: 'fontFamily',
          label: 'Familia de Fuente',
          type: 'select',
          default: 'Inter, system-ui, -apple-system, sans-serif',
          min: undefined,
          max: undefined,
          step: undefined,
          options: [
            { value: 'Inter, system-ui, -apple-system, sans-serif', label: 'Inter (Sans-serif)' },
            { value: 'Georgia, serif', label: 'Georgia (Serif)' },
            { value: 'Monaco, monospace', label: 'Monaco (Monospace)' },
            { value: 'Arial, sans-serif', label: 'Arial (Sans-serif)' },
            { value: 'Helvetica, sans-serif', label: 'Helvetica (Sans-serif)' },
            { value: 'Times, serif', label: 'Times (Serif)' }
          ]
        },
        { key: 'fontSize', label: 'Tamaño Base', type: 'text', default: '16px', min: undefined, max: undefined, step: undefined },
        { key: 'fontSizeSmall', label: 'Tamaño Pequeño', type: 'text', default: '14px', min: undefined, max: undefined, step: undefined },
        { key: 'fontSizeLarge', label: 'Tamaño Grande', type: 'text', default: '18px', min: undefined, max: undefined, step: undefined },
        {
          key: 'fontWeight',
          label: 'Peso de Fuente',
          type: 'select',
          default: '400',
          min: undefined,
          max: undefined,
          step: undefined,
          options: [
            { value: '100', label: '100 - Thin' },
            { value: '300', label: '300 - Light' },
            { value: '400', label: '400 - Regular' },
            { value: '500', label: '500 - Medium' },
            { value: '600', label: '600 - Semibold' },
            { value: '700', label: '700 - Bold' },
            { value: '900', label: '900 - Black' }
          ]
        },
        { key: 'lineHeight', label: 'Altura de Línea', type: 'text', default: '1.5', min: undefined, max: undefined, step: undefined },
        { key: 'letterSpacing', label: 'Espaciado de Letras', type: 'text', default: '0px', min: undefined, max: undefined, step: undefined }
      ]
    }
  ];

  visualEffects = [
    {
      name: 'Efectos Visuales',
      fields: [
        { key: 'textShadow', label: 'Sombra de Texto', type: 'text', default: 'none', min: undefined, max: undefined, step: undefined },
        { key: 'borderRadius', label: 'Radio de Borde', type: 'text', default: '8px', min: undefined, max: undefined, step: undefined },
        { key: 'borderRadiusSmall', label: 'Radio Pequeño', type: 'text', default: '4px', min: undefined, max: undefined, step: undefined },
        { key: 'borderRadiusLarge', label: 'Radio Grande', type: 'text', default: '12px', min: undefined, max: undefined, step: undefined },
        { key: 'boxShadow', label: 'Sombra de Caja', type: 'text', default: '0 1px 3px rgba(0, 0, 0, 0.1)', min: undefined, max: undefined, step: undefined },
        { key: 'backdropBlur', label: 'Desenfoque de Fondo', type: 'text', default: '0px', min: undefined, max: undefined, step: undefined },
        {
          key: 'backgroundOpacity',
          label: 'Opacidad de Fondo',
          type: 'range',
          default: '1',
          min: '0',
          max: '1',
          step: '0.1'
        },
        { key: 'glassEffect', label: 'Efecto de Vidrio', type: 'checkbox', default: false, min: undefined, max: undefined, step: undefined }
      ]
    },
    {
      name: 'Estilos de Input',
      fields: [
        { key: 'inputPadding', label: 'Padding de Input', type: 'text', default: '12px 16px', min: undefined, max: undefined, step: undefined }
      ]
    }
  ];

  previewTheme: any = {};

  // Color suggestions
  showSuggestions = false;
  suggestions: ColorSuggestion[] = [];
  baseColorForSuggestions = '#3B82F6';
  selectedSuggestion: ColorSuggestion | null = null;

  // Tab navigation
  activeTab: 'basic' | 'colors' | 'typography' | 'effects' | 'preview' | 'components' = 'basic';
  tabs = [
    { id: 'basic', label: 'Información Básica', icon: 'info' },
    { id: 'colors', label: 'Colores', icon: 'palette' },
    { id: 'typography', label: 'Tipografía', icon: 'text_fields' },
    { id: 'effects', label: 'Efectos', icon: 'tune' },
    { id: 'preview', label: 'Vista Previa', icon: 'preview' },
    { id: 'components', label: 'Componentes', icon: 'widgets' }
  ];

  // Component-specific style fields
  componentStyles = [
    {
      name: 'Grid',
      fields: [
        { key: 'gridHeaderBgColor', label: 'Header (Grid) - Fondo', default: '#3B82F6' },
        { key: 'gridBodyBgColor', label: 'Body (Grid) - Fondo', default: '#F8FAFC' },
        { key: 'gridIconColor', label: 'Icono (Grid) - Color', default: '#111827' }
      ]
    },
    {
      name: 'Tabla',
      fields: [
        { key: 'tableHeaderBgColor', label: 'Header (Tabla) - Fondo', default: '#E5E7EB' },
        { key: 'tableRowBgColor', label: 'Fila (Tabla) - Fondo', default: '#FFFFFF' }
      ]
    },
    {
      name: 'Menús',
      fields: [
        { key: 'menuBgColor', label: 'Fondo (Menú)', default: '#FFFFFF' },
        { key: 'menuTextColor', label: 'Texto (Menú)', default: '#111827' }
      ]
    },
    {
      name: 'Login',
      icon: 'login',
      fields: [
        { key: 'loginBackgroundColor', label: 'Fondo (Login)', default: '#F8FAFC', type: 'color' },
        { key: 'loginFormBgColor', label: 'Formulario (Login) - Fondo', default: '#FFFFFF', type: 'color' },
        { key: 'loginHeaderColor', label: 'Header (Login) - Color', default: '#3B82F6', type: 'color' },
        { key: 'loginBackgroundImage', label: 'Imagen de Fondo (URL)', default: '', type: 'text' },
        {
          key: 'loginBackgroundSize', label: 'Tamaño de Fondo', default: 'cover', type: 'select',
          options: [
            { value: 'cover', label: 'Cover (Cubrir todo)' },
            { value: 'contain', label: 'Contain (Contener)' },
            { value: '100% 100%', label: 'Estirar' },
            { value: 'auto', label: 'Auto (Original)' }
          ]
        },
        {
          key: 'loginBackgroundPosition', label: 'Posición de Fondo', default: 'center', type: 'select',
          options: [
            { value: 'center', label: 'Centro' },
            { value: 'top', label: 'Arriba' },
            { value: 'bottom', label: 'Abajo' },
            { value: 'left', label: 'Izquierda' },
            { value: 'right', label: 'Derecha' },
            { value: 'top left', label: 'Arriba Izquierda' },
            { value: 'top right', label: 'Arriba Derecha' },
            { value: 'bottom left', label: 'Abajo Izquierda' },
            { value: 'bottom right', label: 'Abajo Derecha' }
          ]
        },
        {
          key: 'loginBackgroundRepeat', label: 'Repetición de Fondo', default: 'no-repeat', type: 'select',
          options: [
            { value: 'no-repeat', label: 'Sin repetir' },
            { value: 'repeat', label: 'Repetir' },
            { value: 'repeat-x', label: 'Repetir horizontal' },
            { value: 'repeat-y', label: 'Repetir vertical' }
          ]
        },
        {
          key: 'loginBackgroundOverlayOpacity', label: 'Opacidad del Overlay', default: '0.5', type: 'range',
          min: '0', max: '1', step: '0.05'
        }
      ]
    }
  ];

  constructor(
    private fb: FormBuilder,
    private appearanceService: AppearanceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.createForm();
  }

  /**
   * Normalize color strings to 6-digit hex (uppercase) when possible.
   * Accepts '#rrggbb' or 'rgb(a)(r,g,b[,a])' and returns '#RRGGBB'.
   * If conversion is not possible, returns null.
   */
  toHexColor(value: string): string | null {
    if (!value) return null;
    const hexMatch = value.match(/^#([0-9A-Fa-f]{6})$/);
    if (hexMatch) return `#${hexMatch[1].toUpperCase()}`;

    const rgbMatch = value.match(/rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|0?\.\d+|1(?:\.0+)?))?\s*\)/);
    if (rgbMatch) {
      const r = Math.max(0, Math.min(255, parseInt(rgbMatch[1], 10)));
      const g = Math.max(0, Math.min(255, parseInt(rgbMatch[2], 10)));
      const b = Math.max(0, Math.min(255, parseInt(rgbMatch[3], 10)));
      const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;

      // Composite onto white background if alpha < 1
      let rr = r, gg = g, bb = b;
      if (a < 1) {
        rr = Math.round((1 - a) * 255 + a * r);
        gg = Math.round((1 - a) * 255 + a * g);
        bb = Math.round((1 - a) * 255 + a * b);
      }

      const rHex = rr.toString(16).padStart(2, '0');
      const gHex = gg.toString(16).padStart(2, '0');
      const bHex = bb.toString(16).padStart(2, '0');
      return `#${rHex}${gHex}${bHex}`.toUpperCase();
    }

    return null;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.themeId = params['id'];
        this.loadTheme();
      } else {
        this.initializeDefaults();
      }
    });

    // Initialize preview with defaults
    this.updatePreview();

    // Watch form changes for live preview
    this.form.valueChanges.subscribe(() => {
      this.updatePreview();
    });
  }

  createForm(): FormGroup {
    const formConfig: any = {
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      isActive: [true],
      isDefault: [false]
    };

    // Add all color fields
    this.colorCategories.forEach(category => {
      category.colors.forEach(color => {
        formConfig[color.key] = [color.default, [Validators.required, this.hexColorValidator]];
      });
    });

    // Add typography fields
    this.typographySettings.forEach(category => {
      category.fields.forEach(field => {
        if (field.type === 'checkbox') {
          formConfig[field.key] = [field.default];
        } else {
          formConfig[field.key] = [field.default, [Validators.required]];
        }
      });
    });

    // Add visual effects fields
    this.visualEffects.forEach(category => {
      category.fields.forEach(field => {
        if (field.type === 'checkbox') {
          formConfig[field.key] = [field.default];
        } else {
          formConfig[field.key] = [field.default, [Validators.required]];
        }
      });
    });

    // Add component style fields
    this.componentStyles.forEach(section => {
      section.fields.forEach((field: any) => {
        if (field.type === 'color' || (!field.type)) {
          // color fields - validate hex
          formConfig[field.key] = [field.default, [Validators.required, this.hexColorValidator]];
        } else if (field.type === 'range') {
          formConfig[field.key] = [field.default];
        } else {
          // text, select fields
          formConfig[field.key] = [field.default];
        }
      });
    });

    return this.fb.group(formConfig);
  }

  hexColorValidator(control: any) {
    const hexColor = /^#[0-9A-Fa-f]{6}$/;
    return hexColor.test(control.value) ? null : { invalidHexColor: true };
  }

  initializeDefaults(): void {
    // Form already has default values from createForm
  }

  loadTheme(): void {
    if (!this.themeId) return;

    this.loading = true;
    this.appearanceService.getById(this.themeId).subscribe({
      next: (theme) => {
        // Normalize colors to hex where necessary before patching the form
        const normalized: any = {};
        Object.entries(theme).forEach(([k, v]) => {
          if (k.includes('Color') && typeof v === 'string') {
            const hex = this.toHexColor(v as string);
            normalized[k] = hex ?? v;
          } else {
            normalized[k] = v;
          }
        });
        this.form.patchValue(normalized);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading theme:', error);
        this.loading = false;
        this.router.navigate(['/appearance']);
      }
    });
  }

  updatePreview(): void {
    const formValue = this.form.value;
    this.previewTheme = { ...formValue };

    // Apply preview to document
    const root = document.documentElement;
    Object.entries(formValue).forEach(([key, value]) => {
      // expose any color-like fields as preview CSS variables (keep naming consistent)
      if (typeof value === 'string' && value.startsWith('#')) {
        const cssKey = key
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase();
        root.style.setProperty(`--preview-${cssKey}`, value as string);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formValue = this.form.value;

    // Normalize color fields to hex before sending to backend
    const normalizedPayload: any = {};
    Object.entries(formValue).forEach(([k, v]) => {
      if (k.includes('Color') && typeof v === 'string') {
        normalizedPayload[k] = this.toHexColor(v) ?? v;
      } else {
        normalizedPayload[k] = v;
      }
    });

    const saveObservable = this.isEdit
      ? this.appearanceService.update(this.themeId!, normalizedPayload)
      : this.appearanceService.create(normalizedPayload);

    saveObservable.subscribe({
      next: (theme) => {
        this.saving = false;
        if (formValue.isDefault) {
          this.appearanceService.applyTheme(theme);
        }
        this.router.navigate(['/appearance']);
      },
      error: (error) => {
        console.error('Error saving theme:', error);
        this.saving = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/appearance']);
  }

  resetToDefaults(): void {
    if (confirm('¿Está seguro de que desea restablecer todos los valores por defecto?')) {
      this.form.reset();
      this.initializeDefaults();
      this.updatePreview();
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors?.['required']) {
      return 'Este campo es requerido';
    }
    if (field?.errors?.['minlength']) {
      return 'Debe tener al menos 3 caracteres';
    }
    if (field?.errors?.['invalidHexColor']) {
      return 'Debe ser un color hexadecimal válido (ej: #3B82F6)';
    }
    return '';
  }

  // Color suggestions methods
  toggleSuggestions(): void {
    this.showSuggestions = !this.showSuggestions;
    if (this.showSuggestions && this.suggestions.length === 0) {
      this.generateSuggestions();
    }
  }

  onBaseColorChange(color: string): void {
    this.baseColorForSuggestions = color;
    if (this.showSuggestions) {
      this.generateSuggestions();
    }
  }

  generateSuggestions(): void {
    this.suggestions = ColorHarmonyGenerator.generateAllSuggestions(this.baseColorForSuggestions);
  }

  selectSuggestion(suggestion: ColorSuggestion): void {
    this.selectedSuggestion = suggestion;

    // Apply the suggested colors to the form
    Object.entries(suggestion.colors).forEach(([key, value]) => {
      if (this.form.get(key)) {
        const final = (typeof value === 'string' && key.includes('Color')) ? (this.toHexColor(value) ?? value) : value;
        this.form.get(key)?.setValue(final as any);
      }
    });

    this.updatePreview();
  }

  applySuggestion(): void {
    if (!this.selectedSuggestion) return;

    const colors = this.selectedSuggestion.colors;

    // Aplicar solo los colores que existan en el formulario
    Object.keys(colors).forEach(colorKey => {
      if (this.form.get(colorKey)) {
        const val = colors[colorKey];
        const final = (typeof val === 'string' && colorKey.includes('Color')) ? (this.toHexColor(val) ?? val) : val;
        this.form.patchValue({ [colorKey]: final });
      }
    });

    // Agregar colores de estado y fondo automáticos
    const statusColors = ColorHarmonyGenerator.generateStatusColors(colors['primaryColor']);
    const backgroundColors = ColorHarmonyGenerator.generateBackgroundAndTextColors();

    this.form.patchValue({
      ...statusColors,
      ...backgroundColors
    });

    // Cerrar el panel de sugerencias
    this.showSuggestions = false;
    this.selectedSuggestion = null;
  }

  discardSuggestion(): void {
    this.selectedSuggestion = null;
  }

  getSuggestionCardClass(suggestion: ColorSuggestion): string {
    let classes = 'suggestion-card';

    if (this.selectedSuggestion?.name === suggestion.name) {
      classes += ' selected';
    }

    if (suggestion.name.includes('Glass Liquid')) {
      classes += ' glass-liquid';
    }

    return classes;
  }

  // Tab navigation methods
  setActiveTab(tabId: string): void {
    this.activeTab = tabId as 'basic' | 'colors' | 'typography' | 'effects' | 'preview' | 'components';
  }

  isActiveTab(tabId: string): boolean {
    return this.activeTab === tabId;
  }
}
