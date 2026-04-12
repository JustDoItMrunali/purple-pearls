import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../product-service';
import { map, Observable, tap } from 'rxjs';
import Product, { ProductResponse } from '../../models/product.model';
import { AsyncPipe } from '@angular/common';
import { ProductCard } from '../product-card/product-card';
import { ProductType } from '../../models/taxonomy.model';
import { ProductFilter } from '../product-filter/product-filter';

@Component({
  selector: 'app-product-list',
  imports: [AsyncPipe, ProductCard,ProductFilter],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  productType$: Observable<ProductType[]> = this.productService.getProductType();

  product$ = this.productService.product$.pipe(
    map((response) => {
      if (!response) return null;
      return {
        ...response,
        pages: Array.from({ length: response.meta.totalPages }, (_, i) => i + 1),
      };
    }),
  );

  ngOnInit(): void {
    this.productType$ = this.productService.getProductType();
    this.productService.getProducts().subscribe();
  }
  goToPage(page: number): void {
    this.productService.getProducts({ page }).subscribe();
  }

  onSearch(query: string): void {
    this.productService.getProducts({ q: query }).subscribe();
  }
}
