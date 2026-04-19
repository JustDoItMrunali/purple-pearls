import { Component, inject } from '@angular/core';
import { AuthService } from '../auth-service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);
  showPassword = false;
  errorMessage: string | null = null;
  
  onRegister(form: NgForm) {
    const { name, email, password, confirmPassword } = form.value;
    if (form.invalid) {
      Object.values(form.controls).forEach((c) => c.markAsTouched());
      return;
    }
    if (password != confirmPassword) {
      alert('Password doesnt match');
      return;
    }
    const registerData = { name, email, password };
    this.authService.register(registerData).subscribe({
      next: (res) => {
        alert('Registered successfully');
        this.router.navigateByUrl('/auth/login');
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'An error occurred during registration.';
      },
    });
  }
}
