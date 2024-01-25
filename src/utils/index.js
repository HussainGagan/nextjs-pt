import { db } from "../../db"

export async function getProducts() {
    try {
        const products = await db.selectFrom("products").selectAll().execute();
        return products;
    } catch (error) {
        throw error

    }
}