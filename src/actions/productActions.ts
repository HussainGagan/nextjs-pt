//@ts-nocheck
"use server";

import { sql } from "kysely";
import { DEFAULT_PAGE_SIZE } from "../../constant";
import { db } from "../../db";
import { InsertProducts, UpdateProducts } from "@/types";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { cache } from "react";

export async function getProducts(
  pageNo = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  sortBy = "",
  categoryId: string,
  priceRangeTo: string,
  gender: string,
  occasions: string,
  discount: string,
  brandId: string
) {
  try {
    let products;
    let dbQuery = db.selectFrom("products").selectAll("products");

    if (sortBy) {
      const [queryName, queryVal] = sortBy.split("-");
      dbQuery = dbQuery.orderBy(`${queryName} ${queryVal}` as any);
    }

    if (brandId) {
      const brandIdsToSearch = brandId.split(",").map(Number);
      // console.log(`"[${brandIdsToSearch}]"`);
      dbQuery = dbQuery.where(
        sql`JSON_OVERLAPS(products.brands, "[${brandIdsToSearch}]")`
      );
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

    if (discount) {
      const [from, to] = discount.split("-");
      dbQuery = dbQuery
        .where("products.discount", ">=", from)
        .where("products.discount", "<=", to);
    }

    if (occasions) {
      const arrOccasions = occasions.split(",");
      if (arrOccasions.length > 0) {
        let condition = sql`(`; // Start group
        arrOccasions.forEach((occasion, index) => {
          if (index > 0) condition = sql`${condition} OR `;
          condition = sql`${condition}FIND_IN_SET(${occasion}, products.occasion)`;
        });
        condition = sql`${condition})`; // Close group
        dbQuery = dbQuery.where(condition);
      }
    }

    const { count } = await dbQuery
      .select(sql`COUNT(DISTINCT products.id) as count`)
      .executeTakeFirst();

    const lastPage = Math.ceil(count / pageSize);

    products = await dbQuery
      .distinct()
      .offset((pageNo - 1) * pageSize)
      .limit(pageSize)
      .execute();

    const numOfResultsOnCurPage = products.length;

    return { products, count, lastPage, numOfResultsOnCurPage };
  } catch (error) {
    throw error;
  }
}

export const getProduct = cache(async function getProduct(productId: number) {
  // console.log("run");
  try {
    const product = await db
      .selectFrom("products")
      .selectAll()
      .where("id", "=", productId)
      .execute();

    return { product };
  } catch (error) {
    return { error: "Could not find the product" };
  }
});

async function enableForeignKeyChecks() {
  await sql`SET foreign_key_checks = 1`.execute(db);
}

async function disableForeignKeyChecks() {
  await sql`SET foreign_key_checks = 0`.execute(db);
}

export async function deleteProduct(productId: number) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { error: "You must be logged in to delete a product" };
    }

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
    revalidatePath("/products");
    return { message: "success" };
  } catch (error) {
    return { error: "Something went wrong, Cannot delete the product" };
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
      brandsMap.set(brandId, brand?.name);
    }
    return brandsMap;
  } catch (error) {
    throw error;
  }
}

export async function getAllProductCategories(products: any) {
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

export async function getProductCategories(productId: number) {
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

export async function updateProductCategories(
  productId: number,
  categoryIds: any
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { error: "You must be logged in to update a product" };
    }

    const values = categoryIds.map((categoryId) => ({
      category_id: categoryId,
      product_id: productId,
    }));

    await db
      .deleteFrom("product_categories")
      .where("product_categories.product_id", "=", productId)
      .execute();

    await db.insertInto("product_categories").values(values).execute();

    revalidatePath(`/products`);
    return { message: "success", success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateProduct(productId: number, value: UpdateProducts) {
  value = {
    ...value,
    price: "0",
  };
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { error: "You must be logged in to update a product" };
    }

    const result = await db
      .updateTable("products")
      .set(value)
      .where("id", "=", productId)
      .executeTakeFirst();
    return { message: "success", success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function addProduct(value: InsertProducts) {
  value = {
    ...value,
    price: "0",
  };
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { error: "You must be logged in to add a product" };
    }
    const result = await db
      .insertInto("products")
      .values(value)
      .executeTakeFirst();

    return {
      productId: Number(result.insertId),
      message: "product inserted",
      success: true,
    };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function addProductIntoCategories(
  productId: number,
  categoryIds: any
) {
  const value = categoryIds.map((id) => ({
    category_id: id,
    product_id: productId,
  }));
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { error: "You must be logged in to add a product" };
    }

    const result = await db
      .insertInto("product_categories")
      .values(value as any)
      .executeTakeFirst();

    revalidatePath("/products");
    return { message: "product inserted into categories", success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

/*
export async function getProducts(
  pageNo = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  sortBy = "",
  categoryId: string,
  priceRangeTo: string,
  gender: string,
  occasions: string,
  discount: string,
  brandId: string
) {
  try {
    let whereClauses = "";
    let orderByClause = "";
    let joinClause = "";

    // Sort By
    if (sortBy) {
      const [queryName, queryVal] = sortBy.split("-");
      orderByClause = `ORDER BY ${queryName} ${queryVal}`;
    }

    // Brand ID
    if (brandId) {
      const brandIdsToSearch = brandId.split(",").map(Number).join(",");
      whereClauses += ` AND JSON_OVERLAPS(products.brands, '[${brandIdsToSearch}]')`;
    }

    // Category ID
    if (categoryId) {
      joinClause = `INNER JOIN product_categories ON product_categories.product_id = products.id`;
      const categoryIds = categoryId.split(",").join(",");
      whereClauses += ` AND product_categories.category_id IN (${categoryIds})`;
    }

    // Price Range
    if (priceRangeTo) {
      whereClauses += ` AND products.price <= ${priceRangeTo}`;
    }

    // Gender
    if (gender) {
      whereClauses += ` AND products.gender = '${gender}'`;
    }

    // Discount
    if (discount) {
      const [from, to] = discount.split("-");
      whereClauses += ` AND products.discount >= ${from} AND products.discount <= ${to}`;
    }

    // Occasions
    let occasionCondition = "";
    if (occasions) {
      const arrOccasions = occasions.split(",");
      arrOccasions.forEach((occasion, index) => {
        if (index > 0) occasionCondition += " OR ";
        occasionCondition += `FIND_IN_SET('${occasion}', products.occasion)`;
      });
      if (occasionCondition) {
        whereClauses += ` AND (${occasionCondition})`;
      }
    }

    const query = sql`
      SELECT DISTINCT products.* FROM products
      ${joinClause ? sql([joinClause]) : sql``}
      WHERE 1=1
      ${sql([whereClauses])}
      ${orderByClause ? sql([orderByClause]) : sql``}
      LIMIT ${pageSize} OFFSET ${(pageNo - 1) * pageSize}
    `;

    const { rows } = await query.execute(db);

    const countQuery = sql`
      SELECT COUNT(DISTINCT products.id) as count FROM products
      ${joinClause ? sql([joinClause]) : sql``}
      WHERE 1=1
      ${sql([whereClauses])}
    `;

    const countResult = await countQuery.execute(db);
    const count = countResult?.count || 0;
    const lastPage = Math.ceil(count / pageSize);

    console.log({ rows, count, lastPage });

    return { rows, count, lastPage };
  } catch (error) {
    throw error;
  }
}
*/
