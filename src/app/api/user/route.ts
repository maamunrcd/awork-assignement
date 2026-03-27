import { NextResponse } from "next/server";
import { getInitialUser } from "@/lib/data/dashboard-data";

export async function GET() {
  return NextResponse.json(getInitialUser());
}
