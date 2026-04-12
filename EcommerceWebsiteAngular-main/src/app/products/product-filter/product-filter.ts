import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../product-service';
import { Subject, debounceTime } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './product-filter.html',
  styleUrl: './product-filter.css',
})
export class ProductFilter implements OnInit {
  private productService = inject(ProductService);
  private filterSubject = new Subject<void>();

  // This was missing!
  types$ = this.productService.getProductType();
  currentFilters: any = {};

  ngOnInit() {
    // Wait 400ms after user stops typing/clicking before calling API
    this.filterSubject.pipe(debounceTime(400)).subscribe(() => {
      this.apply();
    });
  }

  onFilterChange(key: string, event: any) {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.currentFilters[key] = value;
    this.filterSubject.next();
  }

  onPriceChange(key: string, event: any) {
    this.currentFilters[key] = event.target.value;
    this.filterSubject.next();
  }

  apply() {
    this.productService.getProducts(this.currentFilters).subscribe();
  }

  resetFilters(
    typeSelect: HTMLSelectElement,
    min: HTMLInputElement,
    max: HTMLInputElement,
    check: HTMLInputElement,
  ) {
    this.currentFilters = {};
    typeSelect.value = '';
    min.value = '';
    max.value = '';
    check.checked = false;
    this.apply();
  }
}
