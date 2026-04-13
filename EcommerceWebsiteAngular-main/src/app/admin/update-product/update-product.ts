import { Component, inject } from '@angular/core';
import { AdminService } from '../admin-service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-update-product',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './update-product.html',
  styleUrl: './update-product.css',
})
export class UpdateProduct {
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  productId!: number;
  updateProduct(form: NgForm) {
    const productId = this.route.snapshot.paramMap.get('productId');
    this.adminService.updateProduct(this.productId, form.value).subscribe({
      next: (response) => {
        alert('Product updated successfully!');
        form.reset();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
