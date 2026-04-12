import { NextFunction, Request, Response } from "express";
import { Cart } from "../entities/Cart";
import { AppDataSource } from "../data.source";
import { User } from "../entities/User";
import { error } from "node:console";
import { Product } from "../entities/Product";
import { CartItem } from "../entities/CartItem";
import { OrderItem } from "../entities/OrderItem";

export class CartController {
  private static async getOrCreateCart(userId: number): Promise<Cart> {
    const cartRepo = AppDataSource.getRepository(Cart);

    let cart = await cartRepo.findOne({
      where: { user: { user_id: userId } },
      relations: { items: { product: true } },
    });

    if (!cart) {
      cart = cartRepo.create({ user: { user_id: userId } as User, items: [] });
      await cartRepo.save(cart);
    }

    return cart;
  }

  static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as User).user_id;
      const cart = await AppDataSource.getRepository(Cart).findOne({
        where: { user: { user_id: userId } },
        relations: {
          items: {
            product: { subCategory: { category: { productType: true } } },
          },
        },
      });

      if (!cart) {
        return res.status(200).json({ cart_id: null, items: [], total: 0 });
      }

      const total = cart.items.reduce((sum, item) => {
        return sum + Number(item.product.price) * item.quantity;
      }, 0);
      return res.status(200).json({
        cart_id: cart.cart_id,
        items: cart.items.map((item) => ({
          cart_item_id: item.cart_item_id,
          quantity: item.quantity,
          subtotal: Number(item.product.price) * item.quantity,
          product: {
            product_id: item.product.product_id,
            name: item.product.name,
            price: item.product.price,
            stock: item.product.stock,
            imagePath: item.product.imagePath,
          },
        })),
        total: Number(total.toFixed(2)),
      });
    } catch (error) {
      next(error);
    }
  }

  static async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as User).user_id;
      const { productId, quantity = 1 } = req.body;

      if (!productId)
        return res.status(400).json({ error: "ProductId is required" });

      const qty = parseInt(quantity);
      if (isNaN(qty) || qty < 1) {
        return res
          .status(400)
          .json({ error: "Quantity must be positive integer" });
      }

      const product = await AppDataSource.getRepository(Product).findOneBy({
        product_id: Number(productId),
        isActive: true,
      });

      if (!product)
        return res.status(404).json({ error: "Product doesnt exist" });

      if (product.stock < qty) {
        return res
          .status(404)
          .json({ error: `only ${product.stock} is available` });
      }

      const cart = await CartController.getOrCreateCart(userId);
      const cartItemRepo = await AppDataSource.getRepository(CartItem);

      const existingItem = cart.items?.find(
        (i) => i.product.product_id == Number(productId),
      );

      //for existing
      if (existingItem) {
        const newQty = existingItem.quantity + qty;
        if (newQty > product.stock) {
          return res.status(400).json({
            error: `Product is not in stock.. Only ${product.stock} is available`,
          });
        }

        existingItem.quantity = newQty;
        await cartItemRepo.save(existingItem);
        return res.status(200).json({
          message: "Item added to cart",
          cart_item_id: existingItem.cart_item_id,
          quantity: newQty,
        });
      }

      //new item
      const newItem = cartItemRepo.create({ cart, product, quantity: qty });
      await cartItemRepo.save(newItem);

      return res.status(201).json({
        message: "Item added to cart !",
        cart_item_id: newItem.cart_item_id,
        quantity: qty,
      });
    } catch (error) {
      next(error);
    }
  }


  static async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as User).user_id;
      const cartItemId = Number(req.params.cartItemId);
      const { quantity } = req.body;

      if (isNaN(cartItemId))
        return res.status(400).json({ error: "Invalid credentials" });

      const qty = parseInt(quantity);
      if (isNaN(qty) || qty < 1) {
        return res
          .status(400)
          .json({ error: "quantity must be positvr number" });
      }

      const cartItemRepo = AppDataSource.getRepository(CartItem);

      const item = await cartItemRepo.findOne({
        where: { cart_item_id: cartItemId },
        relations: { cart: { user: true }, product: true },
      });

      if (!item) return res.status(404).json({ error: "Cart item not found" });

      if (item.cart.user.user_id !== userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      if (qty > item.product.stock) {
        return res
          .status(400)
          .json({ error: `Only ${item.product.stock} units in stock` });
      }
      item.quantity = qty;
      await cartItemRepo.save(item);

      return res.status(200).json({
        message: "Cart item updated",
        cart_item_id: cartItemId,
        quantity: qty,
      });
    } catch (err) {
      next(err);
    }
  }

  static async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userID = (req.user as User).user_id;
      const cartItemId = Number(req.params.cartItemId);

      if (isNaN(cartItemId))
        return res.status(400).json({ error: "Invalid credentials" });

      const cartItemRepo = await AppDataSource.getRepository(CartItem);

      const item = await cartItemRepo.findOne({
        where: { cart_item_id: cartItemId },
        relations: { cart: { user: true } },
      });

      if (!item) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      if (item.cart.user.user_id !== userID) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await cartItemRepo.remove(item);

      return res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userID = (req.user as User).user_id;

      const cart = await AppDataSource.getRepository(Cart).findOne({
        where: { user: { user_id: userID } },
        relations: { items: true },
      });

      if (!cart)
        return res.status(200).json({ message: "Cart is already empty" });

      await AppDataSource.getRepository(CartItem).remove(cart.items);

      return res.status(200).json({ message: "Cart Cleared" });
    } catch (err) {
      next(err);
    }
  }
}
