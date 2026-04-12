"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistController = void 0;
const data_source_1 = require("../data.source");
const Product_1 = require("../entities/Product");
const Wishlist_1 = require("../entities/Wishlist");
class WishlistController {
    static async addWishlist(req, res, next) {
        try {
            const userId = req.user.user_id;
            const { productId } = req.body;
            if (!productId) {
                return res.status(200).json({ error: "Product id is invalid" });
            }
            const wishlistRepo = data_source_1.AppDataSource.getRepository(Wishlist_1.Wishlist);
            const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
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
            }
            else {
                const newWish = wishlistRepo.create({
                    user: { user_id: userId },
                    product: product,
                });
                await wishlistRepo.save(newWish);
                return res.status(201).json({ message: "Product added to wishlist" });
            }
        }
        catch (err) {
            next(err);
        }
    }
    static async getMyWishlist(req, res, next) {
        try {
            const userId = req.user.user_id;
            const wishlistRepo = data_source_1.AppDataSource.getRepository(Wishlist_1.Wishlist);
            const items = await wishlistRepo.find({
                where: { user: { user_id: userId } },
                relations: ["product"],
            });
            return res.status(200).json({ data: items });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.WishlistController = WishlistController;
