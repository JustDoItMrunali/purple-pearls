import { Component, inject } from '@angular/core';
import { AuthService } from '../auth-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  //backend errors
  errorMessage: string | null = null;
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach((control) => control.markAsTouched());
      return;
    }
    this.errorMessage = null;
    this.authService.login(form.value).subscribe({
      next: (res) => {
        const role = res.user.role?.toUpperCase();
        // alert('Login Successfull');
        Swal.fire({
          title: 'Login successful!!',
          icon: 'success',
          draggable: true,
        });
        if (role === 'ADMIN') {
          this.router.navigate(['/admin/admin-landing']);
        } else if (role === 'USER') {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.router.navigateByUrl(returnUrl);
        } else {
          alert('Role not recognized. Please contact support.');
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'An unexpected error occurred.';
      },
    });
  }
}
