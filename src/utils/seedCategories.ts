import { faker } from "@faker-js/faker";
import { db } from "../../db";

export default async function seedCategories() {
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

    subcategories = [...subcategories, ...subcategoriesForThisMain];
  });

  // Step 4: Insert subcategories
  await db.insertInto("categories").values(subcategories).execute();
}

/* 
export default async function seedCategories() {
  const uniqueMainCategoryNames = new Set();
  const uniqueSubcategoryNames = new Set();

  // Step 1: Generate and insert unique main categories
  const mainCategories = Array.from({ length: 10 }, () => {
    let name;
    do {
      name = faker.commerce.department();
    } while (uniqueMainCategoryNames.has(name));
    uniqueMainCategoryNames.add(name);

    return { name, parent_id: null };
  });

  await db.insertInto("categories").values(mainCategories).execute();

  // Step 2: Retrieve main categories IDs
  const mainCategoriesIds = await db
    .selectFrom("categories")
    .select("id")
    .where("parent_id", "is", null)
    .execute();

  // Step 3: Generate unique subcategories for each main category
  let subcategories = [];
  mainCategoriesIds.forEach(mainCategory => {
    const subcategoriesForThisMain = Array.from({ length: 5 }, () => {
      let name;
      do {
        name = faker.commerce.product();
      } while (uniqueSubcategoryNames.has(name));
      uniqueSubcategoryNames.add(name);

      return { name, parent_id: mainCategory.id };
    });

    subcategories = [...subcategories, ...subcategoriesForThisMain];
  });

  // Step 4: Insert subcategories
  await db.insertInto("categories").values(subcategories).execute();
}
*/
