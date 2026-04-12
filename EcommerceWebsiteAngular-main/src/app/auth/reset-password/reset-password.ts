import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  private authService = inject(AuthService);
  resetPassowrd(resetForm: NgForm) {
    this.authService.resetPassword(resetForm.value).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }
}
