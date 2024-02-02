import { NextRequest } from "next/server";

import { getDistinctOccasion } from "@/actions/productActions";

export async function GET(req: NextRequest) {
  try {
    const occasions = await getDistinctOccasion();
    return Response.json(occasions);
  } catch (error) {
    return Response.json(error, {
      status: 404,
    });
  }
}
