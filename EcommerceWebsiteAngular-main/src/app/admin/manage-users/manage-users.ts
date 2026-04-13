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
    const request = isCurrentlyLocked
      ? this.adminService.unlockStatus(user.user_id)
      : this.adminService.lockStatus(user.user_id);

    request.subscribe({
      next: (res) => {
        console.log(res);
        this.loadCustomers();
      },
      error: (err) => {
        alert(err.error.message);
      },
    });
  }
}
