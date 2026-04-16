import fs from "fs/promises"
import { NextResponse } from "next/server"
import { RESULTS_FILE } from "@/lib/paths"


export async function GET() {
  try {
    const data = await fs.readFile(RESULTS_FILE, "utf-8")
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="quiz-results.json"',
      },
    })
  } catch {
    return new NextResponse("[]", {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="quiz-results.json"',
      },
    })
  }
}
