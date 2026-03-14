import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-appearance-container',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="appearance-container">
      <header class="page-header">
        <div class="header-content">
          <h1>Gestión de Apariencia</h1>
          <button class="btn btn-primary" (click)="createNew()">
            <span class="material-icons">add</span>
            Nuevo Tema
          </button>
        </div>
      </header>
      
      <main class="page-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./appearance-container.component.scss']
})
export class AppearanceContainerComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  createNew(): void {
    this.router.navigate(['/appearance/create']);
  }
}