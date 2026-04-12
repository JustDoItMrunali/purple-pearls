import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth-service';
import { AsyncPipe } from '@angular/common';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterModule,Sidebar,RouterOutlet],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  private authService = inject(AuthService);
  user$ = this.authService.currentUser$;
}
