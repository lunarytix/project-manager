import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { DynamicFormComponent, DynamicFormConfig } from '../../../../shared/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginFormConfig!: DynamicFormConfig;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginFormConfig = {
      fields: [
        {
          key: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'Ingresa tu email',
          required: true,
          validation: { email: true },
          order: 1
        },
        {
          key: 'password',
          type: 'password',
          label: 'Contraseña',
          placeholder: 'Ingresa tu contraseña',
          required: true,
          validation: { minLength: 6 },
          order: 2
        }
      ],
      submitButton: {
        label: this.isSubmitting ? 'Entrando...' : 'Entrar',
        variant: 'primary',
        loading: this.isSubmitting
      },
      layout: 'vertical'
    };
  }

  onFormSubmit(formValue: any): void {
    const { email, password } = formValue;
    
    if (!email || !password) {
      this.error = 'Email y contraseña son requeridos';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    // Update button state
    if (this.loginFormConfig.submitButton) {
      this.loginFormConfig.submitButton.loading = true;
      this.loginFormConfig.submitButton.label = 'Entrando...';
    }

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.isSubmitting = false;
        if (this.loginFormConfig.submitButton) {
          this.loginFormConfig.submitButton.loading = false;
        }
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isSubmitting = false;
        if (this.loginFormConfig.submitButton) {
          this.loginFormConfig.submitButton.loading = false;
          this.loginFormConfig.submitButton.label = 'Entrar';
        }
        this.error = err?.error?.message || 'Error en el login';
      }
    });
  }
}
