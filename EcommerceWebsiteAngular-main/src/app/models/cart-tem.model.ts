import Product from './product.model';

export interface CartItems {
  cart_item_id: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  cart_id: number;
  items: CartItems[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
