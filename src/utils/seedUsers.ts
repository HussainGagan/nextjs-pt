import { faker } from "@faker-js/faker";

import { Users, Products, Decimal, Comments } from "../types";
import { db } from "../../db";

function generateUser() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

export default async function seedUsers() {
  const brands = Array.from({ length: 50 }, generateUser);
  await db.insertInto("users").values(brands).execute();
}
