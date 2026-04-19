import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../admin-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-users',
  imports: [CommonModule, AsyncPipe, RouterLink],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.css',
})
export class ManageUsers implements OnInit {
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  customer$ = this.adminService.customer$;
  loading = false;
  errorMessage: string | null = null;

  customerId!: number;
  ngOnInit(): void {
    this.customer$ = this.adminService.customer$;
    this.loadCustomers();
  }

  private loadCustomers(): void {
    this.loading = true;
    this.adminService.getCustomers().subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error.message ?? 'Failed to load customers';
      },
    });
  }

  viewCustomerDetails(userId: number): void {
    this.router.navigate(['/customer-detail', userId]);
  }

  updateStatus(user: User) {
    this.errorMessage = null;
    const isCurrentlyLocked = user.isLocked;
    const action = isCurrentlyLocked ? 'unlock' : 'lock';

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this user's status?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        const request = isCurrentlyLocked
          ? this.adminService.unlockStatus(user.user_id)
          : this.adminService.lockStatus(user.user_id);

        request.subscribe({
          next: (res) => {
            Swal.fire(
              'Updated!',
              `User has been ${isCurrentlyLocked ? 'unlocked' : 'locked'}.`,
              'success',
            );
            this.loadCustomers();
          },
          error: (err) => {
            Swal.fire('Error', err.error.message || 'Something went wrong', 'error');
          },
        });
      }
    });
  }
}
