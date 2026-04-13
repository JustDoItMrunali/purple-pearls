import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth-service';
import { AsyncPipe } from '@angular/common';
import { tap } from 'rxjs';
import { Role } from '../directive/role';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AsyncPipe, Role],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;

  private router = inject(Router);
  isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // console.log('Logged out');
        Swal.fire({
          title: 'Are you sure? You want to logout???',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, logout!',
        }).then((result) => {
          if (result.isConfirmed)
            Swal.fire({
              title: 'Logged out!',
              text: 'You have been successfully logged out.',
              icon: 'success',
            });
          this.router.navigate(['/auth/login']);
        });
      },
    });
  }
}
