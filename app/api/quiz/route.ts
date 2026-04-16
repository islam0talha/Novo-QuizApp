import { getStore } from "@netlify/blobs"
import { type QuizAttempt } from "@/lib/questions"

// POST - save a quiz attempt
export async function POST(req: Request) {
  try {
    const store = getStore("quiz-attempts")
    const attempt: QuizAttempt = await req.json()

    // Generate a unique ID if not present
    const id = attempt.id || crypto.randomUUID()

    await store.setJSON(id, {
      ...attempt,
      id, // ensure ID is saved
      createdAt: new Date().toISOString(),
    })

    return Response.json({ success: true, id })
  } catch (error) {
    console.error("Error saving quiz attempt:", error)
    return Response.json(
      { success: false, error: "Failed to save attempt" },
      { status: 500 }
    )
  }
}

// GET - fetch all attempts
export async function GET() {
  try {
    const store = getStore("quiz-attempts")
    const { blobs } = await store.list()

    const attempts = await Promise.all(
      blobs.map(({ key }) => store.get(key, { type: "json" }))
    )

    // Filter out nulls in case of missing data
    return Response.json(attempts.filter(Boolean))
  } catch (error) {
    console.error("Error fetching quiz attempts:", error)
    return Response.json(
      { success: false, error: "Failed to fetch attempts" },
      { status: 500 }
    )
  }
}
