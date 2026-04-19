// import { Component, inject } from '@angular/core';
// import { AdminService } from '../admin-service';
// import { FormsModule, NgForm } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-manage-products',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './manage-products.html',
//   styleUrl: './manage-products.css',
// })
// export class ManageProducts {
//   private adminService = inject(AdminService);

//   addProducts(form: NgForm) {
//     this.adminService.createProduct(form.value).subscribe({
//       next: (response) => {
//         alert('Product created successfully!');
//         form.reset();
//       },
//       error:(err)=>{
//         console.error(err);
//       }
//     });
//   }
// }

import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../admin-service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../products/product-service';
import { SubCategory } from '../../models/taxonomy.model';

@Component({
  selector: 'app-manage-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-products.html',
  styleUrl: './manage-products.css',
})
export class ManageProducts implements OnInit {
  private adminService = inject(AdminService);
  productService = inject(ProductService);

  subcategory: SubCategory[] = [];

  ngOnInit(): void {
    this.productService.getSubCategory().subscribe((data)=>{
      this.subcategory = data;
    })
  }

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.selectedFile = input.files?.[0] ?? null;
  }

  addProducts(form: NgForm): void {
    if (form.invalid) return;
    const formData = new FormData();
    const values = form.value;

    formData.append('name', values.name);
    formData.append('description', values.description ?? '');
    formData.append('price', values.price);
    formData.append('stock', values.stock);
    formData.append('subCategoryId', values.subCategoryId);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.adminService.createProduct(formData).subscribe({
      next: () => {
        alert('Product created successfully!');
        form.reset();
        this.selectedFile = null;
        this.previewUrl = null;
      },
      error: (err) => {
        console.error(err.error);
      },
    });
  }
}
