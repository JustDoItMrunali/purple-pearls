import e, { NextFunction, Response, Request } from "express";
import { User } from "../entities/User";
import { AppDataSource } from "../data.source";
import { Product } from "../entities/Product";
import { Wishlist } from "../entities/Wishlist";

export class WishlistController {
  static async addWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as User).user_id;
      const { productId } = req.body;

      if (!productId) {
        return res.status(200).json({ error: "Product id is invalid" });
      }

      const wishlistRepo = AppDataSource.getRepository(Wishlist);
      const productRepo = AppDataSource.getRepository(Product);

      const product = await productRepo.findOneBy({
        product_id: Number(productId),
      });
      if (!product) {
        return res.status(404).json({ error: "Product does not exist" });
      }

      const existWishlist = await wishlistRepo.findOne({
        where: {
          user: { user_id: userId },
          product: { product_id: Number(productId) },
        },
      });

      if (existWishlist) {
        await wishlistRepo.remove(existWishlist);
        return res
          .status(200)
          .json({ message: "Product removed from wishlist" });
      } else {
        const newWish = wishlistRepo.create({
          user: { user_id: userId } as User,
          product: product,
        });
        await wishlistRepo.save(newWish);
        return res.status(201).json({ message: "Product added to wishlist" });
      }
    } catch (err) {
      next(err);
    }
  }

  static async getMyWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as User).user_id;
      const wishlistRepo = AppDataSource.getRepository(Wishlist);
      const items = await wishlistRepo.find({
        where: { user: { user_id: userId } },
        relations: ["product"],
      });

      return res.status(200).json({ wishlist: items });
    } catch (err) {
      next(err);
    }
  }
}
