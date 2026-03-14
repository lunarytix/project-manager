import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleService } from '../../../../core/services/module.service';
import { Module as AppModule } from '../../../../core/models/module.model';

@Component({
  selector: 'app-eliminar-modulo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eliminar-modulo.component.html',
  styleUrls: ['./eliminar-modulo.component.scss']
})
export class EliminarModuloComponent implements OnInit {
  moduleId: string | null = null;
  module: AppModule | null = null;
  loading = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private moduleService: ModuleService, private router: Router) {}

  ngOnInit(): void {
    this.moduleId = this.route.snapshot.paramMap.get('id');
    if (this.moduleId) this.loadModule(this.moduleId);
  }

  loadModule(id: string) {
    this.loading = true;
    this.moduleService.getById(id).subscribe({ next: m => { this.module = m; this.loading = false; }, error: () => { this.error = 'No se pudo cargar el módulo'; this.loading = false; } });
  }

  confirmDelete(): void {
    if (!this.moduleId) return;
    this.moduleService.delete(this.moduleId).subscribe({ next: () => this.router.navigate(['/modules/list']), error: () => alert('Error al eliminar') });
  }

  cancel(): void { this.router.navigate(['/modules/list']); }
}
