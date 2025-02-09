import * as purchaseRepository from "../repositories/purchaseRepository";
import * as productRepository from "../repositories/productRepository";
import * as userRepository from "../repositories/userRepository";

export async function purchaseProduct(
    userId: number,
    productId: number,
): Promise<number> {

        const product = await productRepository.findProductById(productId);
        const user = await userRepository.findUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        
        const userBalance = user.balance!;

        if (!product) {
            throw new Error("Product not found");
        }

        if (product.quantity === 0) {
            throw new Error("Product out of stock");
        }

        if (userBalance < product.price) {
            throw new Error("Insufficient balance");
        }

        const newBalance = userBalance - product.price;
        const updateUser = { id: userId, balance: newBalance };
        const updateProduct = { id: productId, quantity: product.quantity - 1 };
        await purchaseRepository.purchaseProduct(updateUser, updateProduct);
        return newBalance;
}

