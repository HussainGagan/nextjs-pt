"use server";
import { db } from "../../db";

export async function getAllBrands() {
  try {
    let brands = await db
      .selectFrom("brands")
      .selectAll()
      .orderBy("created_at desc")
      .execute();
    return brands;
  } catch (error) {
    throw error;
  }
}

export async function addBrand(value) {
  try {
    await db.insertInto("brands").values(value).execute();
    return { message: "success" };
  } catch (err) {
    throw err;
  }
}

export async function editBrand(brandId, value) {
  try {
    await db
      .updateTable("brands")
      .set(value)
      .where("brands.id", "=", brandId)
      .execute();

    return { message: "success" };
  } catch (err) {
    throw err;
  }
}

export async function deleteBrand(brandId) {
  try {
    await db.deleteFrom("brands").where("brands.id", "=", brandId).execute();

    return { message: "success" };
  } catch (err) {
    throw err;
  }
}
