import Product from './product.model';
import {User} from './user.model';

export interface Review {
  review_id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
}

export interface ReviewResponse {
  averageRating: number;
  product_id: number;
  reviews: Review[]; 
  totalReview: number;
}
