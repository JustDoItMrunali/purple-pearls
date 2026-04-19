import { SubCategory, Breadcrumb } from './taxonomy.model';

export default interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imagePath: string ;
  isActive: boolean;
  createdAt: Date | string; 
  updatedAt: Date | string;
  subCategory?: SubCategory;
  breadcrumb?: Breadcrumb;
}

export interface ProductResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
