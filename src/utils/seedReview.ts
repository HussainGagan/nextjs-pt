import { faker } from "@faker-js/faker";
import { db } from "../../db";

function generateReview(existingCombinations: Set<any>) {
  let userId, productId, combination;

  // generates a unique combination
  do {
    userId = faker.number.int({ min: 1, max: 50 });
    productId = faker.number.int({ min: 1, max: 100 });
    combination = `${userId}-${productId}`;
  } while (existingCombinations.has(combination));

  existingCombinations.add(combination);

  return {
    user_id: userId, // Random user ID between 1 and 50
    product_id: productId, // Random product ID between 1 and 100
    message: faker.lorem.sentences(),
    rating: faker.number.int({ min: 1, max: 5 }), // Random rating between 1 and 5
    created_at: faker.date.past({ years: 2 }), // Review created within the past 2 years
  };
}

export default async function seedReviews() {
  const uniqueCombination = new Set();
  const reviews = Array.from({ length: 200 }, () =>
    generateReview(uniqueCombination)
  ); // Generate 200 reviews
  await db.insertInto("reviews").values(reviews).execute();
}
