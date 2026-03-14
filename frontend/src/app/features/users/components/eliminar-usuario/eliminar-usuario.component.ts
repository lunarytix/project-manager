import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-eliminar-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eliminar-usuario.component.html',
  styleUrls: ['./eliminar-usuario.component.scss']
})
export class EliminarUsuarioComponent implements OnInit {
  userId: string | null = null;
  usuario: User | null = null;
  loading = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) this.loadUser(this.userId);
  }

  loadUser(id: string) {
    this.loading = true;
    this.userService.getById(id).subscribe({ next: u => { this.usuario = u; this.loading = false; }, error: () => { this.error = 'No se pudo cargar usuario'; this.loading = false; } });
  }

  confirmDelete(): void {
    if (!this.userId) return;
    this.userService.delete(this.userId).subscribe({ next: () => this.router.navigate(['/users/list']), error: () => alert('Error al eliminar') });
  }

  cancel(): void {
    this.router.navigate(['/users/list']);
  }
}
