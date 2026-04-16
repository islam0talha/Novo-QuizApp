import { NextResponse } from "next/server"
import { getResultsData } from "@/lib/actions"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    const data = await getResultsData()
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="quiz-results.json"',
      },
    })
  } catch (error) {
    console.error("Error generating download:", error)
    return new NextResponse("[]", {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="quiz-results.json"',
      },
    })
  }
}
