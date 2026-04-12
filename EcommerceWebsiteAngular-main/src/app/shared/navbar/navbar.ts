import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth-service';
import { AsyncPipe } from '@angular/common';
import { tap } from 'rxjs';
import { Role } from '../directive/role';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AsyncPipe,Role],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;

  logout() {
    this.authService.logout().subscribe({
      next:()=>{
        console.log("Logged out")
      }
    });
  }
}
