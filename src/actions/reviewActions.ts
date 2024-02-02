"use server";

import { db } from "../../db";

export async function getReviewsForProduct(
  productId: number,
  loadMoreReviews = "false"
) {
  try {
    let dbQuery = db
      .selectFrom("reviews")
      .innerJoin("users", "users.id", "reviews.user_id")
      .select([
        "users.id as user_id",
        "reviews.id as review_id",
        "users.name",
        "users.email",
        "reviews.message",
        "reviews.rating",
        "reviews.message",
        "reviews.created_at",
      ])
      .where("product_id", "=", productId)
      .orderBy("created_at desc");

    if (loadMoreReviews === "false") {
      dbQuery = dbQuery.limit(5);
    }

    const result = await dbQuery.execute();

    return result;
  } catch (err) {
    throw err;
  }
}

export async function postReview(data) {
  try {
    const result = await db.insertInto("reviews").values(data).execute();
    return { message: "success" };
  } catch (err) {
    throw err;
  }
}

export async function editReview(reviewId, data) {
  try {
    const result = await db
      .updateTable("reviews")
      .set(data)
      .where("reviews.id", "=", reviewId)
      .executeTakeFirst();
    return { message: "success" };
  } catch (err) {
    throw err;
  }
}
export async function deleteReview(reviewId) {
  try {
    const result = await db
      .deleteFrom("reviews")
      .where("reviews.id", "=", reviewId)
      .executeTakeFirst();
    return { message: "success" };
  } catch (err) {
    throw err;
  }
}
