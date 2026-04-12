export interface ProductType {
  type_id: number;
  name: string;
}

export interface Category {
  category_id: number;
  name: string;
  productType?: ProductType;
}

export interface SubCategory {
  sub_category_id: number;
  name: string;
  category?: Category;
}

export interface Breadcrumb {
  type: string;
  category: string;
  subCategory: string;
}
