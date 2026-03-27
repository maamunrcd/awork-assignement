import { NextResponse } from "next/server";
import { getInitialTasks } from "@/lib/data/dashboard-data";

export async function GET() {
  return NextResponse.json(getInitialTasks());
}
