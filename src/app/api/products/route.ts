import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";

import { getProducts } from "@/utils";

export async function GET(req: NextRequest) {
  try {
    const products = await getProducts();
    return Response.json(products);
  } catch (error) {
    return Response.json(error, {
      status: 404,
    });
  }
}
