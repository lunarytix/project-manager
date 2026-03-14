import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PermissionCatalogService } from '../../../../core/services/permission-catalog.service';

@Component({
  selector: 'app-permission-catalog-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './permission-catalog-edit.component.html'
})
export class PermissionCatalogEditComponent implements OnInit {
  form!: FormGroup;
  id?: string;
  loading = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private svc: PermissionCatalogService, public router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({ 
      nombre: ['', Validators.required], 
      descripcion: [''],
      icono: [''] 
    });
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.loading = true;
      this.svc.get(this.id).subscribe({ 
        next: d => { 
          console.log('Loaded data:', d);
          this.form.patchValue(d); 
          this.loading = false 
        }, 
        error: (error) => {
          console.error('Load error:', error);
          this.loading = false
        }
      });
    }
  }

  save() {
    if (this.form.invalid) {
      console.log('Form is invalid:', this.form.errors);
      return;
    }
    
    const payload = this.form.value;
    console.log('Saving payload:', payload);
    this.loading = true;
    
    const op = this.id ? this.svc.update(this.id, payload) : this.svc.create(payload);
    op.subscribe({ 
      next: (result) => { 
        console.log('Save successful:', result);
        this.loading = false; 
        this.router.navigate(['permission-catalogs']); 
      }, 
      error: (error) => {
        console.error('Save error:', error);
        this.loading = false;
      }
    });
  }
}
