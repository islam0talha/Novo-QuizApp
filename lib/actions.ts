"use server"

import { getStore } from "@netlify/blobs"
import type { QuizAttempt } from "./questions"
import crypto from "node:crypto"

const STORE_NAME = "quiz-attempts"

async function readResults(): Promise<QuizAttempt[]> {
  try {
    const store = getStore(STORE_NAME)
    const { blobs } = await store.list()

    const attempts = await Promise.all(
      blobs.map(async (blob) => {
        try {
          return (await store.get(blob.key, { type: "json" })) as QuizAttempt
        } catch (e) {
          console.error(`Error fetching blob ${blob.key}:`, e)
          return null
        }
      })
    )

    return attempts.filter((a): a is QuizAttempt => a !== null)
  } catch (error) {
    console.error("Error reading results from Blobs:", error)
    return []
  }
}

export async function saveQuizAttempt(attempt: QuizAttempt): Promise<void> {
  try {
    const store = getStore(STORE_NAME)
    const id = attempt.id || crypto.randomUUID()
    await store.setJSON(id, {
      ...attempt,
      id,
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error saving quiz attempt to Blobs:", error)
    throw new Error("Failed to save quiz attempt")
  }
}

export async function getResultsData(): Promise<string> {
  const results = await readResults()
  return JSON.stringify(results, null, 2)
}

export async function resetQuizStats(): Promise<void> {
  try {
    const store = getStore(STORE_NAME)
    const { blobs } = await store.list()
    // Delete blobs one by one (Blobs API doesn't have a direct clear/delete all)
    await Promise.all(blobs.map((blob) => store.delete(blob.key)))
  } catch (error) {
    console.error("Error resetting quiz stats in Blobs:", error)
    throw new Error("Failed to reset stats")
  }
}

export type QuestionStats = {
  questionIndex: number
  questionText: string
  totalAttempts: number
  correctCount: number
  optionBreakdown: Record<number, number>
}

export async function getQuizStats(): Promise<{
  totalAttempts: number
  questionStats: QuestionStats[]
}> {
  const results = await readResults()

  // Aggregate stats per question
  const statsMap: Record<number, QuestionStats> = {}

  results.forEach((attempt) => {
    attempt.results.forEach((res) => {
      if (!statsMap[res.questionIndex]) {
        statsMap[res.questionIndex] = {
          questionIndex: res.questionIndex,
          questionText: res.question,
          totalAttempts: 0,
          correctCount: 0,
          optionBreakdown: {},
        }
      }
      statsMap[res.questionIndex].totalAttempts++

      // Count specific option choices
      const opt = res.selectedAnswer
      statsMap[res.questionIndex].optionBreakdown[opt] =
        (statsMap[res.questionIndex].optionBreakdown[opt] || 0) + 1

      if (res.isCorrect) {
        statsMap[res.questionIndex].correctCount++
      }
    })
  })

  return {
    totalAttempts: results.length,
    questionStats: Object.values(statsMap).sort(
      (a, b) => a.questionIndex - b.questionIndex
    ),
  }
}
