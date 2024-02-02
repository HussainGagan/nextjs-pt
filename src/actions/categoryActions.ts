"use server";
import { db } from "../../db";

export async function getAllCategories() {
  try {
    let brands = await db
      .selectFrom("categories")
      .selectAll()
      // .orderBy("categories.created_at desc")
      .execute();
    return brands;
  } catch (error) {
    throw error;
  }
}

export async function deleteCategory(categoryId: number) {
  async function deleteSubCategories(parentId: number) {
    const subCategories = await db
      .selectFrom("categories")
      .select("id")
      .where("parent_id", "=", parentId)
      .execute();

    for (const category of subCategories) {
      await deleteSubCategories(category.id);
      await db.deleteFrom("categories").where("id", "=", category.id).execute();
    }
  }

  // First delete all nested replies
  await deleteSubCategories(categoryId);

  await db.deleteFrom("categories").where("id", "=", categoryId).execute();
}

export async function editCategory(categoryId, value) {
  try {
    await db
      .updateTable("categories")
      .set(value)
      .where("categories.id", "=", categoryId)
      .execute();

    return { message: "success" };
  } catch (err) {
    throw err;
  }
}
export async function postCategory(value) {
  try {
    await db.insertInto("categories").values(value).execute();
    // revalidatePath("/categories");
    return { message: "success" };
  } catch (err) {
    throw err;
  }
}
