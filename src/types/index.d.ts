import type { ColumnType } from "kysely";

export type Decimal = ColumnType<string, number | string, number | string>;

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Brands {
  id: Generated<number>;
  name: string;
  website: string | null;
  updated_at: Generated<Date>;
  created_at: Generated<Date>;
}

export interface Categories {
  id: Generated<number>;
  name: string;
  parent_id: number | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface Comments {
  id: Generated<number>;
  user_id: number | null;
  product_id: number;
  comment: string | null;
  parent_comment_id: number | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
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
  discount: string;
  gender: "boy" | "girl" | "men" | "women";
  id: Generated<number>;
  name: string;
  occasion: string;
  old_price: string;
  price: string;
  image_url: string;
  updated_at: Generated<Date>;
  rating: string;
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
  id: Generated<number>;
  email: string;
  name: string;
  password: string;
  address: string | null;
  city: string | null;
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
