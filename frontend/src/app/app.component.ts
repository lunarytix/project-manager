import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TopbarComponent } from './shared/topbar/topbar.component';
import { AuthService } from './core/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSnackBarModule, TopbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'project-manager';
  isAuthenticated$: Observable<boolean>;

  constructor(private auth: AuthService) {
    this.isAuthenticated$ = this.auth.authState$.pipe(map(s => !!s && !!s.isAuthenticated));
  }
}
