import { Component, OnDestroy, HostListener } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ModuleService } from '../../core/services/module.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnDestroy {
  showMenu = false;
  showProfile = false;
  user: any = null;
  modules: any[] = [];
  private subs: Subscription[] = [];

  constructor(private router: Router, private location: Location, private auth: AuthService, private moduleService: ModuleService) {
    this.user = this.auth.getCurrentUser();
    // subscribe to auth changes to update user and load modules when logged in
    const s = this.auth.authState$.subscribe((s) => {
      if (s && s.isAuthenticated) {
        this.user = s.usuario || this.auth.getCurrentUser();
        this.loadModules();
      } else {
        this.user = null;
        this.modules = [];
      }
    });
    this.subs.push(s);
  }

  toggleMenu() { this.showMenu = !this.showMenu; if (this.showMenu) this.showProfile = false; }
  toggleProfile() { this.showProfile = !this.showProfile; if (this.showProfile) this.showMenu = false; }

  goBack() { this.location.back(); this.showMenu = false; }
  goDashboard() { this.router.navigate(['/dashboard']); this.showMenu = false; }

  goSettings() { this.router.navigate(['/auth/profile']); this.showProfile = false; }
  logout() { this.auth.logout(); this.router.navigate(['/auth/login']); this.showProfile = false; }

  loadModules() {
    this.moduleService.getAll().subscribe({ next: (m) => { this.modules = m || []; }, error: () => { this.modules = []; } });
  }

  navigateTo(path: string) {
    if (!path) return;
    // ensure leading slash
    const p = path.startsWith('/') ? path : '/' + path;
    this.router.navigate([p]);
    this.showMenu = false;
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(): void {
    if (this.showMenu || this.showProfile) { this.showMenu = false; this.showProfile = false; }
  }
}
