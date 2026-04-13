import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../product-service';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ProductCard } from '../product-card/product-card';
import { ProductFilter } from '../product-filter/product-filter';
import { ProductType, SubCategory } from '../../models/taxonomy.model';

@Component({
  selector: 'app-product-list',
  imports: [AsyncPipe, ProductCard, ProductFilter],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);

  productType$: Observable<ProductType[]> = this.productService.getProductType();
  subCategories$: Observable<SubCategory[]> | null = null;
  selectedSubCategoryId: number | null = null;
  selectedTypeId: number | null = null;

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
    this.productService.getProducts({}).subscribe();
  }

  goToPage(page: number): void {
    this.productService.getProducts({ page }).subscribe();
  }

  onSearch(term: string): void {
    const trimmed = term.trim();
    this.selectedSubCategoryId = null;
    this.selectedTypeId = null;
    this.subCategories$ = null;
    this.productService.getProducts({ q: trimmed, page: 1 }).subscribe();
  }

  onTypeClick(typeId: number): void {
    this.selectedTypeId = typeId;
    this.selectedSubCategoryId = null;
    this.subCategories$ = this.productService.getProductSubCategory(typeId);
    this.productService.getProducts({ typeId, page: 1 }).subscribe();
  }

  onSubCategoryClick(subCategoryId: number): void {
    this.selectedSubCategoryId = subCategoryId;
    this.productService.getProducts({ subCategoryId, page: 1 }).subscribe();
  }
}
