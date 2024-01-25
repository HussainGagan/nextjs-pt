import { sql } from "kysely";
import { DEFAULT_PAGE_SIZE } from "../../constant";
import { db } from "../../db";

export async function getProducts(pageNo = 1) {
  try {
    const products = await db
      .selectFrom("products")
      .selectAll()
      .offset((pageNo - 1) * 10)
      .limit(DEFAULT_PAGE_SIZE)
      .execute();

    const result = await db
      .selectFrom("products")
      .select(sql`COUNT(*) as count`)
      .executeTakeFirst();

    return { products, count: result.count };
  } catch (error) {
    throw error;
  }
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});
