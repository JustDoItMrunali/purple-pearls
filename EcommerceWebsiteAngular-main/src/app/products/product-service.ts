import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import Product from '../models/product.model';
import { Review, ReviewResponse } from '../models/review.model';
import { Category, ProductType, SubCategory } from '../models/taxonomy.model';
interface ProductResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private productSubject = new BehaviorSubject<ProductResponse | null>(null);
  private productTypeSubject = new BehaviorSubject<ProductType[]>([]);

  product$ = this.productSubject.asObservable();
  productType$ = this.productTypeSubject.asObservable();

  private productUrl = 'http://localhost:3000/products';
  private taxanomyUrl = 'http://localhost:3000/taxonomy';

  private currentFilters: any = {};

  getProducts(filters: any = {}, replace = false): Observable<ProductResponse> {
    this.currentFilters = replace ? { ...filters } : { ...this.currentFilters, ...filters };

    let params = new HttpParams();
    Object.keys(this.currentFilters).forEach((key) => {
      const val = this.currentFilters[key];
      if (val !== null && val !== undefined && val !== '') {
        params = params.set(key, val);
      }
    });

    return this.http
      .get<ProductResponse>(`${this.productUrl}/get-products`, { params })
      .pipe(tap((response) => this.productSubject.next(response)));
  }

  getProducByID(product_id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productUrl}/${product_id}`);
  }

  //get product review
  getProductReview(product_id: number): Observable<ReviewResponse> {
    return this.http.get<ReviewResponse>(`http://localhost:3000/reviews/get-review/${product_id}`);
  }

  //addProduct review
  addProductReview(productId: number, rating: number, comment: string): Observable<Review> {
    return this.http.post<Review>(`http://localhost:3000/reviews/add-review/${productId}`, {
      rating,
      comment,
    });
  }

  //Taxonomy
  getProductType(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(`${this.taxanomyUrl}/product_type`);
  }

  getSubCategory(): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(`${this.taxanomyUrl}/subcategory`);
  }

  getProductCategory(typeId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.taxanomyUrl}/product_type/${typeId}/categories`);
  }

  getProductSubCategory(categoryId: number): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(
      `${this.taxanomyUrl}/categories/${categoryId}/subcategories`,
    );
  }

  resetFilters() {
    this.currentFilters = {};
  }
}
