import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../product-service';
import {
  map,
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  shareReplay,
} from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ProductCard } from '../product-card/product-card';
import { ProductType } from '../../models/taxonomy.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ProductCard, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Fetch product types and cache the result
  productTypes$: Observable<ProductType[]> = this.productService
    .getProductType()
    .pipe(shareReplay(1));

  searchTerm = '';
  selectedTypeId: number | null = null;
  currentPage = 1;

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
    // Initial fetch
    this.applyFilters();

    // Debounced Search
    this.searchSubject
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.searchTerm = term;
        this.currentPage = 1;
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters(): void {
    this.productService
      .getProducts(
        {
          q: this.searchTerm || undefined,
          typeId: this.selectedTypeId || undefined,
          page: this.currentPage,
        },
        true,
      )
      .subscribe();
  }

  onSearchInput(value: string): void {
    this.searchSubject.next(value.trim());
  }

  onSearchEnter(): void {
    this.searchSubject.next(this.searchTerm.trim());
  }

  onTypeClick(typeId: number): void {
    // Toggle: if same type clicked, clear it
    this.selectedTypeId = this.selectedTypeId === typeId ? null : typeId;
    this.currentPage = 1;
    this.applyFilters();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  // Helper to find the name of the selected type for the filter chip
  get selectedTypeName(): string | null {
    let name: string | null = null;
    this.productTypes$.pipe(takeUntil(this.destroy$)).subscribe((types) => {
      name = types.find((t) => t.type_id === this.selectedTypeId)?.name || null;
    });
    return name;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedTypeId = null;
    this.currentPage = 1;
    this.applyFilters();
  }
}
