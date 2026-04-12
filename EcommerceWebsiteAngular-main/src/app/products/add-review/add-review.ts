import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product-service';

@Component({
  selector: 'app-add-review',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-review.html',
  styleUrl: './add-review.css',
})
export class AddReview {
  //passed from productDetail page
  @Input() productId!: number;
  private productService = inject(ProductService);

  rating: number = 5;
  comment: string = '';
  successMessage = '';
  errorMessage = '';

  submitReview() {
    this.productService.addProductReview(this.productId, this.rating, this.comment).subscribe({
      next: (res) => {
        this.successMessage = 'Review submitted successfully!';
        this.comment = ''; 
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to submit review.';
        this.successMessage = '';
      },
    });
  }
}
