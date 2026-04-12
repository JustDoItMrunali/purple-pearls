import Product from './product.model';

export interface OrderItem {
  order_item_id: number;
  productName: string; 
  priceAtPurchase: number; 
  quantity: number;
  product: Product; 
}
