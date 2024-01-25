import type { ColumnType } from "kysely";

export type Decimal = ColumnType<string, number | string, number | string>;

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Brands {
  created_at: Generated<Date>;
  id: Generated<number>;
  name: string;
  updated_at: Generated<Date>;
  website: string | null;
}

export interface Categories {
  created_at: Generated<Date>;
  id: Generated<number>;
  name: string | null;
  parent_id: number | null;
  updated_at: Generated<Date>;
}

export interface Comments {
  comment: string | null;
  id: Generated<number>;
  parent_comment_id: number | null;
  product_id: number;
  user_id: number | null;
}

export interface ProductCategories {
  category_id: number;
  created_at: Generated<Date>;
  id: Generated<number>;
  product_id: number;
  updated_at: Generated<Date>;
}

export interface Products {
  brands: string;
  colors: string;
  created_at: Generated<Date>;
  description: string;
  discount: Generated<Decimal>;
  gender: "boy" | "girl" | "men" | "women";
  id: Generated<number>;
  name: string;
  occasion: string;
  old_price: Decimal;
  price: Decimal;
  updated_at: Generated<Date>;
}

export interface Reviews {
  created_at: Generated<Date>;
  id: Generated<number>;
  message: string;
  product_id: number;
  rating: Decimal;
  updated_at: Generated<Date>;
  user_id: number;
}

export interface Users {
  email: string;
  id: Generated<number>;
  name: string;
  password: string | null;
  provider: string | null;
  provider_id: string | null;
}

export interface Database {
  brands: Brands;
  categories: Categories;
  comments: Comments;
  product_categories: ProductCategories;
  products: Products;
  reviews: Reviews;
  users: Users;
}
