import { faker } from "@faker-js/faker";
import { db } from "../../db";

function generateUser() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

async function seedUsers() {
  const brands = Array.from({ length: 50 }, generateUser);
  await db.insertInto("users").values(brands).execute();
}

function generateProduct() {
  const oldPrice = parseFloat(faker.commerce.price({ min: 100, max: 2000 }));
  const discountPercentage = faker.number.int({ min: 0, max: 15 });
  const discountAmount = (discountPercentage / 100) * oldPrice;
  const price = oldPrice - discountAmount;

  const occasions = [
    "casual",
    "business",
    "formal",
    "sport",
    "party",
    "travel",
  ];

  // Array of random brand IDs (assuming you have 10 brands, for example)
  const numberOfBrands = faker.number.int({ min: 0, max: 15 }); // Number of brands per product
  const brands = Array.from({ length: numberOfBrands }, () =>
    faker.datatype.number({ min: 1, max: 15 })
  );

  // Generate an array of random color hex codes
  const numberOfColors = faker.number.int({ min: 0, max: 15 }); // Number of colors per product
  const colors = Array.from({ length: numberOfColors }, () =>
    faker.internet.color()
  );

  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    brands: brands.toString(),
    colors: colors.toString(),
    discount: discountPercentage.toFixed(2).toString(),
    // prettier-ignore
    gender: faker.helpers.arrayElement(["boy", "girl", "men", "women"]) as ("boy" | "girl" | "men" | "women"),
    occasion: faker.helpers.arrayElement(occasions),
    old_price: oldPrice.toFixed(2).toString(),
    price: price.toFixed(2).toString(),
  };
}

async function seedProducts() {
  const products = Array.from({ length: 100 }, generateProduct);
  await db.insertInto("products").values(products).execute();
}

async function seedCategories() {
  // Step 1: Generate and insert main categories
  const mainCategories = Array.from({ length: 10 }, () => ({
    name: faker.commerce.department(),
    parent_id: null,
  }));

  await db.insertInto("categories").values(mainCategories).execute();

  // Step 2: Retrieve main categories IDs
  const mainCategoriesIds = await db
    .selectFrom("categories")
    .select("id")
    .where("parent_id", "is", null)
    .execute();

  // Step 3: Generate subcategories for each main category
  let subcategories: { name: string; parent_id: number }[] = [];
  mainCategoriesIds.forEach((mainCategory) => {
    const subcategoriesForThisMain = Array.from({ length: 5 }, () => ({
      name: faker.commerce.product(),
      parent_id: mainCategory.id,
    }));

    subcategories = [...subcategoriesForThisMain];
  });

  // Step 4: Insert subcategories
  await db.insertInto("categories").values(subcategories).execute();
}

async function seedProductCategories() {
  let productCategories = [];

  for (let productId = 1; productId <= 100; productId++) {
    // Each product is associated with 1 to 3 categories
    const numberOfCategories = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < numberOfCategories; i++) {
      const categoryId = faker.number.int({ min: 1, max: 60 });

      productCategories.push({
        product_id: productId,
        category_id: categoryId,
      });
    }
  }

  // Removing duplicates
  // The key part is comparing index with the index returned by findIndex. If they are the same, it means the current element (value) is the first occurrence of this combination of product_id and category_id in the array.
  // If they are not the same, it means the current element is a duplicate (i.e., there was an earlier occurrence of this combination), and hence, it should be filtered out.
  productCategories = productCategories.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.product_id === value.product_id &&
          t.category_id === value.category_id
      )
  );

  await db.insertInto("product_categories").values(productCategories).execute();
}

function generateBrand() {
  return {
    name: faker.company.name(),
    website: faker.datatype.boolean() ? faker.internet.url() : null, // Randomly decide if a website is present
  };
}

async function seedBrands() {
  const brands = Array.from({ length: 50 }, generateBrand); // Generate 50 brands
  await db.insertInto("brands").values(brands).execute();
}

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

async function seedReviews() {
  const uniqueCombination = new Set();
  const reviews = Array.from({ length: 200 }, () =>
    generateReview(uniqueCombination)
  ); // Generate 200 reviews
  await db.insertInto("reviews").values(reviews).execute();
}

// function generateComment(
//   userId: number,
//   productId: number,
//   parentCommentId: number | null = null
// ) {
//   return {
//     user_id: userId,
//     product_id: productId,
//     parent_comment_id: parentCommentId,
//     comment: faker.lorem.sentences(),
//   };
// }

// async function seedComments() {
//   const comments = [];
//   const numberOfPrimaryComments = 200; // Adjust as needed
//   const repliesPerComment = faker.number.int({ min: 0, max: 3 }); // 0-3 replies per comment

//   // Generate primary comments
//   for (let i = 0; i < numberOfPrimaryComments; i++) {
//     const userId = faker.number.int({ min: 1, max: 50 });
//     const productId = faker.number.int({ min: 1, max: 100 });
//     comments.push(generateComment(userId, productId));
//   }

//   // Generate nested comments
//   comments.forEach((comment, index) => {
//     for (let i = 0; i < repliesPerComment; i++) {
//       const userId = faker.number.int({ min: 1, max: 50 });
//       // Nested comment for the current comment
//       comments.push(generateComment(userId, comment.product_id, index + 1));
//     }
//   });

//   await db.insertInto("comments").values(comments).execute();
// }

// ////////////////////////////// COMMENTS SEEDER FUNCTION

async function insertCommentAndGetId(comment: any) {
  const [insertedComment] = await db
    .insertInto("comments")
    .values(comment)
    .returning("id")
    .execute();

  return insertedComment.id;
}

async function generateAndInsertNestedComments(
  productId: number,
  maxDepth: number,
  currentDepth = 1,
  parentCommentId: number
) {
  if (currentDepth === 0) return;
  if (currentDepth > maxDepth) return;

  const numberOfReplies = faker.number.int({ min: 1, max: 3 }); // Random number of replies

  for (let i = 0; i < numberOfReplies; i++) {
    const userId = faker.number.int({ min: 1, max: 50 });
    const comment = {
      comment: faker.lorem.sentences(),
      user_id: userId,
      product_id: productId,
      parent_comment_id: parentCommentId,
    };

    const newCommentId = await insertCommentAndGetId(comment);

    // Recursive call for further nested comments
    await generateAndInsertNestedComments(
      productId,
      maxDepth,
      currentDepth + 1,
      newCommentId
    );
  }
}

async function seedComments() {
  const numberOfPrimaryComments = 200; // Adjust as needed

  for (let i = 0; i < numberOfPrimaryComments; i++) {
    const userId = faker.number.int({ min: 1, max: 50 });
    const productId = faker.number.int({ min: 1, max: 100 });

    const primaryComment = {
      comment: faker.lorem.sentences(),
      user_id: userId,
      product_id: productId,
    };

    const primaryCommentId = await insertCommentAndGetId(primaryComment);

    // Determine the max depth of nesting for replies
    const maxNestingDepth = faker.number.int({ min: 0, max: 3 });

    // Generate nested comments for the primary comment
    await generateAndInsertNestedComments(
      productId,
      maxNestingDepth,
      1,
      primaryCommentId
    );
  }
}
