"use server";

import { sql } from "kysely";
import { DEFAULT_PAGE_SIZE } from "../../constant";
import { db } from "../../db";

export async function getProducts(
  pageNo = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  sortBy = "",
  categoryId,
  priceRangeTo,
  gender,
  occasions,
  discount,
  brandId
) {
  try {
    let products;
    let dbQuery = db.selectFrom("products").selectAll("products");

    if (sortBy) {
      const [queryName, queryVal] = sortBy.split("-");
      dbQuery = dbQuery.orderBy(`${queryName} ${queryVal}`);
    }

    if (brandId) {
      // console.log(brandId);
      // products = dbQuery.where("products.brands", "in", brandId.split(","));
      // products = dbQuery.where(sql`FIND_IN_SET(${brandId}, products.brands)`);
    }

    if (categoryId) {
      dbQuery = dbQuery
        .innerJoin(
          "product_categories",
          "product_categories.product_id",
          "products.id"
        )
        .where("product_categories.category_id", "in", categoryId?.split(","));
    }

    if (priceRangeTo) {
      dbQuery = dbQuery.where("products.price", "<=", priceRangeTo);
    }

    if (gender) {
      dbQuery = dbQuery.where("products.gender", "=", gender);
    }
    if (occasions) {
      dbQuery = dbQuery.where("products.occasion", "in", occasions.split(","));
    }

    if (discount) {
      const [from, to] = discount.split("-");
      dbQuery = dbQuery
        .where("products.discount", ">=", from)
        .where("products.discount", "<=", to);
    }

    const result = await dbQuery
      .select(sql`COUNT(DISTINCT products.id) as count`)
      .executeTakeFirst();

    products = await dbQuery
      .distinct()
      .offset((pageNo - 1) * pageSize)
      .limit(pageSize)
      .execute();

    return { products, count: result.count };
  } catch (error) {
    throw error;
  }
}
export async function getProduct(productId) {
  "use server";
  try {
    const product = await db
      .selectFrom("products")
      .selectAll()
      .where("id", "=", productId)
      .execute();

    return product;
  } catch (error) {
    throw error;
  }
}

async function enableForeignKeyChecks() {
  await sql`SET foreign_key_checks = 1`.execute(db);
}

async function disableForeignKeyChecks() {
  await sql`SET foreign_key_checks = 0`.execute(db);
}

export async function deleteProduct(productId) {
  try {
    await disableForeignKeyChecks();
    await db
      .deleteFrom("product_categories")
      .where("product_categories.product_id", "=", productId)
      .execute();
    await db
      .deleteFrom("reviews")
      .where("reviews.product_id", "=", productId)
      .execute();

    await db
      .deleteFrom("comments")
      .where("comments.product_id", "=", productId)
      .execute();

    await db.deleteFrom("products").where("id", "=", productId).execute();

    await enableForeignKeyChecks();
    return { message: "success" };
  } catch (error) {
    throw error;
  }
}

export async function MapBrandIdsToName(brandsId) {
  const brandsMap = new Map();
  try {
    for (let i = 0; i < brandsId.length; i++) {
      const brandId = brandsId.at(i);
      const brand = await db
        .selectFrom("brands")
        .select("name")
        .where("id", "=", +brandId)
        .executeTakeFirst();
      brandsMap.set(brandId, brand.name);
    }
    return brandsMap;
  } catch (error) {
    throw error;
  }
}

export async function getAllProductCategories(products) {
  try {
    const productsId = products.map((product) => product.id);
    const categoriesMap = new Map();

    for (let i = 0; i < productsId.length; i++) {
      const productId = productsId.at(i);
      const categories = await db
        .selectFrom("product_categories")
        .innerJoin(
          "categories",
          "categories.id",
          "product_categories.category_id"
        )
        .select("categories.name")
        .where("product_categories.product_id", "=", productId)
        .execute();
      categoriesMap.set(productId, categories);
    }
    return categoriesMap;
  } catch (error) {
    throw error;
  }
}
export async function getProductCategories(productId) {
  try {
    const categories = await db
      .selectFrom("product_categories")
      .innerJoin(
        "categories",
        "categories.id",
        "product_categories.category_id"
      )
      .select(["categories.id", "categories.name"])
      .where("product_categories.product_id", "=", productId)
      .execute();

    return categories;
  } catch (error) {
    throw error;
  }
}

export async function updateProductCategories(productId, categoryIds) {
  try {
    const values = categoryIds.map((categoryId) => ({
      category_id: categoryId,
      product_id: productId,
    }));

    await db
      .deleteFrom("product_categories")
      .where("product_categories.product_id", "=", productId)
      .execute();

    await db.insertInto("product_categories").values(values).execute();

    return { message: "success" };
  } catch (error) {
    throw error;
  }
}

export async function getDistinctOccasion() {
  try {
    const occasion = await db
      .selectFrom("products")
      .select("occasion")
      .distinct()
      .execute();
    return occasion.map((val) => val.occasion);
  } catch (err) {
    throw err;
  }
}

export async function updateProduct(productId: number, value: {}) {
  const oldPrice = parseFloat(value.old_price);
  const discount = parseFloat(value.discount);
  const newPrice = oldPrice - (discount / 100) * oldPrice;
  value = {
    ...value,
    price: newPrice.toFixed(2).toString(),
  };
  try {
    const result = await db
      .updateTable("products")
      .set(value)
      .where("id", "=", productId)
      .executeTakeFirst();
    return { message: "success" };
  } catch (err) {
    throw err;
  }
}

export async function addProduct(value: {}) {
  const oldPrice = parseFloat(value.old_price);
  const discount = parseFloat(value.discount);
  const newPrice = oldPrice - (discount / 100) * oldPrice;
  value = {
    ...value,
    price: newPrice.toFixed(2).toString(),
  };
  try {
    const result = await db
      .insertInto("products")
      .values(value as any)
      .executeTakeFirst();

    return Number(result.insertId);
  } catch (err) {
    throw err;
  }
}
export async function addProductIntoCategories(productId, categoryIds) {
  const value = categoryIds.map((id) => ({
    category_id: id,
    product_id: productId,
  }));
  try {
    const result = await db
      .insertInto("product_categories")
      .values(value as any)
      .executeTakeFirst();
    return { message: "success" };
  } catch (err) {
    throw err;
  }
}
