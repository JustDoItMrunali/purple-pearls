import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth-service';
import { User } from '../../models/user.model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [AsyncPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;
  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;
  }
}
