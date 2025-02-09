import pool from "../config/db";
import { Product } from "../models/productModel";

export async function findProductById(productId: number): Promise<Product | null> {
    const query = "SELECT * FROM products WHERE id = $1";
    const values = [productId];
    const { rows } = await pool.query<Product>(query, values);
    return rows[0] || null;
}

