import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  otp: string = '';
  sendOtp(email: string) {
    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        // console.log(res.resetCode);
        this.otp = res.resetCode;
        console.log(this.otp);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }
}
