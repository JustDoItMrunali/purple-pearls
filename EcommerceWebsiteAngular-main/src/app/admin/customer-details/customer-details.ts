import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { User } from '../../models/user.model';
import { AdminService } from '../admin-service';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterLink],
  templateUrl: './customer-details.html',
  styleUrl: './customer-details.css',
})
export class CustomerDetails implements OnInit {
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);

  customer$!: Observable<User>;

  ngOnInit(): void {
    this.customer$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('userId'));
        return this.adminService.getCustomerDetails(id);
      }),
    );
  }
}
