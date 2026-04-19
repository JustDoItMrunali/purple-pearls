import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin-service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-product.html',
  styleUrl: './update-product.css',
})
export class UpdateProduct implements OnInit {
  @ViewChild('productForm') productForm!: NgForm; // Access the form

  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productId!: number;

  ngOnInit(): void {
    // 1. Get ID from URL
    const idParam = this.route.snapshot.paramMap.get('productId');
    if (idParam) {
      this.productId = +idParam;
      this.loadProductDetails();
    }
  }

  loadProductDetails() {
    this.adminService.getProductById(this.productId).subscribe({
      next: (product) => {
        // 2. Pre-fill the form using setValues or patchValue
        // Ensure the keys match your 'name' attributes in HTML
        setTimeout(() => {
          this.productForm.form.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            subCategoryId: product.subCategory?.sub_category_id || product.subCategoryId,
          });
        });
      },
      error: (err) => console.error('Could not load product', err),
    });
  }

  updateProduct(form: NgForm) {
    if (form.invalid) return;

    this.adminService.updateProduct(this.productId, form.value).subscribe({
      next: () => {
        alert('Product updated successfully!');
        this.router.navigate(['/admin/admin-landing']); 
      },
      error: (err) => console.error(err),
    });
  }
}
