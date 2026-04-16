import { getStore } from "@netlify/blobs"
import { type QuizAttempt } from "@/lib/questions"
import crypto from "node:crypto"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// POST - save a quiz attempt
export async function POST(req: Request) {
  try {
    console.log("POST /api/quiz - Received attempt")
    const store = getStore("quiz-attempts")
    const attempt: QuizAttempt = await req.json()

    // Generate a unique ID if not present
    const id =
      attempt.id ||
      (crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2))

    await store.setJSON(id, {
      ...attempt,
      id, // ensure ID is saved
      createdAt: new Date().toISOString(),
    })

    console.log(`POST /api/quiz - Successfully saved attempt ${id}`)
    return Response.json({ success: true, id })
  } catch (error) {
    console.error("POST /api/quiz - Error saving quiz attempt:", error)
    return Response.json(
      { success: false, error: "Failed to save attempt" },
      { status: 500 }
    )
  }
}

// GET - fetch all attempts
export async function GET() {
  try {
    console.log("GET /api/quiz - Fetching all attempts")
    const store = getStore("quiz-attempts")
    const { blobs } = await store.list()

    const attempts = await Promise.all(
      blobs.map(({ key }) => store.get(key, { type: "json" }))
    )

    console.log(
      `GET /api/quiz - Successfully fetched ${attempts.length} attempts`
    )
    // Filter out nulls in case of missing data
    return Response.json(attempts.filter((a) => a !== null))
  } catch (error) {
    console.error("GET /api/quiz - Error fetching quiz attempts:", error)
    return Response.json(
      { success: false, error: "Failed to fetch attempts" },
      { status: 500 }
    )
  }
}
