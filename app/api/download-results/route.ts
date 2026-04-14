import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const RESULTS_FILE = path.join(process.cwd(), "results.json");

export async function GET() {
  try {
    const data = await fs.readFile(RESULTS_FILE, "utf-8");
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="quiz-results.json"',
      },
    });
  } catch {
    return new NextResponse("[]", {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="quiz-results.json"',
      },
    });
  }
}
