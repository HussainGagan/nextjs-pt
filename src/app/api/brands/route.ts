import { NextRequest, NextResponse } from "next/server";

import { getAllBrands } from "@/actions/brandActions";
import { MapBrandIdsToName } from "@/actions/productActions";

export async function GET(req: NextRequest) {
  try {
    const brands = await getAllBrands();
    return Response.json(brands);
  } catch (error) {
    return Response.json(error, {
      status: 404,
    });
  }
}
