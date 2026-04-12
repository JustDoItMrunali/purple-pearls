import Product from './product.model';
import {User} from './user.model';

export interface Wishlist {
  wishlist_id: number;
  createdAt: Date;
  user: User;
  product: Product;
  addedAt: Date;
}

export interface WishlistResponse{
    product_id:number;
    wishlist:Wishlist[];
}