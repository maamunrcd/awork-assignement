import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(
  request: Request,
  { params }: { params: { schemaRef: string } }
) {
  const { schemaRef } = params;
  try {
    const filePath = path.join(process.cwd(), "src/lib/data", `schema-${schemaRef}.json`);
    const fileContent = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(fileContent));
  } catch (error) {
    return NextResponse.json({ error: "Schema not found" }, { status: 404 });
  }
}
