import { NextResponse } from "next/server";
import { getTaskData } from "@/lib/data/dashboard-data";

export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  const data = getTaskData(params.taskId);
  if (!data) return NextResponse.json({});
  return NextResponse.json(data);
}
