import { Component, inject } from '@angular/core';
import { AdminService } from '../admin-service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-products.html',
  styleUrl: './manage-products.css',
})
export class ManageProducts {
  private adminService = inject(AdminService);

  addProducts(form: NgForm) {
    this.adminService.createProduct(form.value).subscribe({
      next: (response) => {
        alert('Product created successfully!');
        form.reset();
      },
      error:(err)=>{
        console.error(err);
      }
    });
  }
}
