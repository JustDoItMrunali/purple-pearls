import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import Product from '../models/product.model';
import { Review, ReviewResponse } from '../models/review.model';
import { Wishlist, WishlistResponse } from '../models/wishlist.model';
import { Category, ProductType, SubCategory } from '../models/taxonomy.model';
import { Cart, CartItems } from '../models/cart-tem.model';
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

  //display all products
  // getProducts(filters: any = {}): Observable<ProductResponse> {
  //   let params = new HttpParams();
  //   Object.keys(filters).forEach((key) => {
  //     if (filters[key]) {
  //       params = params.append(key, filters[key].toString());
  //     }
  //   });
  //   return this.http.get<ProductResponse>(`${this.productUrl}/get-products`, { params }).pipe(
  //     tap((response) => {
  //       this.productSubject.next(response);
  //     }),
  //   );
  // }

  // Update your getProducts method to be more flexible
  // getProducts(filters: any = {}): Observable<ProductResponse> {
  //   let params = new HttpParams();

  //   // Map all filters to HttpParams
  //   Object.keys(filters).forEach((key) => {
  //     if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
  //       params = params.append(key, filters[key].toString());
  //     }
  //   });

  //   return this.http
  //     .get<ProductResponse>(`${this.productUrl}/get-products`, { params })
  //     .pipe(tap((response) => this.productSubject.next(response)));
  // }

  // product-service.ts
  getProducts(filters: any = {}): Observable<ProductResponse> {
    // This cleans up empty values so you don't send ?typeId=&minPrice=null
    const params = Object.keys(filters).reduce((acc, key) => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        acc[key] = filters[key];
      }
      return acc;
    }, {} as any);

    return this.http
      .get<ProductResponse>(`${this.productUrl}/get-products`, { params })
      .pipe(tap((response) => this.productSubject.next(response)));
  }

  //display single product by detail
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

  private taxanomyUrl = 'http://localhost:3000/taxonomy';
  //get all product type
  getProductType(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(`${this.taxanomyUrl}/product_type`);
  }

  getProductCategory(typeId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.taxanomyUrl}/product_type/${typeId}/categories`);
  }

  getProductCategoryById(categoryId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.taxanomyUrl}/categories/${categoryId}`);
  }

  getProductSubCategory(categoryId: number): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(
      `${this.taxanomyUrl}/categories/${categoryId}/subcategories`,
    );
  }

  getProductSubCategoryById(subCategoryId: number): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(`${this.taxanomyUrl}/subcategories/${subCategoryId}`);
  }
}
