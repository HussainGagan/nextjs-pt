import { NextRequest } from "next/server";

import { getAllCategories } from "@/actions/categoryActions";

export async function GET(req: NextRequest) {
  try {
    const categories = await getAllCategories();
    return Response.json(categories);
  } catch (error) {
    return Response.json(error, {
      status: 404,
    });
  }
}
