import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../product-service';
import { map, Observable, retry, switchMap, tap } from 'rxjs';
import Product from '../../models/product.model';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewResponse } from '../../models/review.model';
import { AddReview } from '../add-review/add-review';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule, RouterModule, AsyncPipe,AddReview],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  product$!: Observable<Product>;
  review$!: Observable<ReviewResponse>;

  ngOnInit(): void {
    const id$ = this.route.paramMap.pipe(map((params) => Number(params.get('product_id'))));

    this.product$ = id$.pipe(
      switchMap((id) => this.productService.getProducByID(id)),
      tap((products) => console.log('Reviews:', products)),
    );

    this.review$ = id$.pipe(
      switchMap((id) => this.productService.getProductReview(id)),
      tap((reviews) => console.log('Reviews', reviews)),
    );
  }

  addReview(){

  }
}
