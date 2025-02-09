import pool from "../config/db";
import { Product } from '../models/productModel';
import { User } from '../models/userModel';

export async function purchaseProduct(
    user: Pick<User, "id" | "balance">,
    product: Pick<Product, "id" | "quantity">    
): Promise<void> {
    const client = await pool.connect(); 

    try {
        await client.query("BEGIN"); 

        await client.query("UPDATE users SET balance = $1 WHERE id = $2", [user.balance, user.id]);
        await client.query("INSERT INTO purchases (user_id, product_id) VALUES ($1, $2)", [user.id, product.id]);
        await client.query("UPDATE products SET quantity = $1 WHERE id = $2", [product.quantity - 1, product.id]);

        await client.query("COMMIT");

    } catch (error) {
        await client.query("ROLLBACK"); 
        throw error;
    } finally {
        client.release(); 
    }
}