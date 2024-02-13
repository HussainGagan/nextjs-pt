"use server";
import { revalidatePath } from "next/cache";
import { db } from "../../db";
import { InsertCategories, UpdateCategories } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function getCategories({ sortDesc = false } = {}) {
  try {
    let categories = db.selectFrom("categories").selectAll();

    if (sortDesc) {
      categories = categories.orderBy("categories.created_at desc");
    }

    categories = await categories.execute();

    return categories;
  } catch (error) {
    throw error;
  }
}

export async function deleteCategory(categoryId: number) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { error: "You must be logged in to edit a product" };
    }

    async function deleteSubCategories(parentId: number) {
      const subCategories = await db
        .selectFrom("categories")
        .select("id")
        .where("parent_id", "=", parentId)
        .execute();

      for (const category of subCategories) {
        await deleteSubCategories(category.id);
        // delete all the reference of category id from the product categories and then delete the category
        await db
          .deleteFrom("product_categories")
          .where("product_categories.category_id", "=", category.id)
          .execute();
        await db
          .deleteFrom("categories")
          .where("id", "=", category.id)
          .execute();
      }
    }

    // First delete all nested replies
    await deleteSubCategories(categoryId);

    await db
      .deleteFrom("product_categories")
      .where("product_categories.category_id", "=", categoryId)
      .execute();
    await db.deleteFrom("categories").where("id", "=", categoryId).execute();

    revalidatePath("/categories");

    return { message: "success" };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function editCategory(
  categoryId: number,
  value: UpdateCategories
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { error: "You must be logged in to edit a product" };
    }

    if (!value.name) {
      return { error: "Category name is missing" };
    }

    await db
      .updateTable("categories")
      .set(value)
      .where("categories.id", "=", categoryId)
      .execute();

    revalidatePath("/categories");

    return { message: "success" };
  } catch (err: any) {
    return { error: err.message };
  }
}
export async function postCategory(value: InsertCategories) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { error: "You must be logged in to edit a product" };
    }

    if (!value.name) {
      return { error: "Category name is missing" };
    }

    await db.insertInto("categories").values(value).execute();

    revalidatePath("/categories");

    return { message: "success" };
  } catch (err: any) {
    return { error: err.message };
  }
}
