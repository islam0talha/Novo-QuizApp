"use server"

import fs from "fs/promises"
import path from "path"
import os from "os"
import type { QuizAttempt } from "./questions"

// Use /tmp for Netlify / serverless environments which have read-only file systems
const RESULTS_FILE = process.env.NODE_ENV === "production" 
  ? path.join(os.tmpdir(), "results.json")
  : path.join(process.cwd(), "results.json")

async function readResults(): Promise<QuizAttempt[]> {
  try {
    const data = await fs.readFile(RESULTS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function saveQuizAttempt(attempt: QuizAttempt): Promise<void> {
  const results = await readResults()
  results.push(attempt)
  await fs.writeFile(RESULTS_FILE, JSON.stringify(results, null, 2), "utf-8")
}

export async function getResultsData(): Promise<string> {
  try {
    const data = await fs.readFile(RESULTS_FILE, "utf-8")
    return data
  } catch {
    return "[]"
  }
}

export async function resetQuizStats(): Promise<void> {
  await fs.writeFile(RESULTS_FILE, JSON.stringify([], null, 2), "utf-8")
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
      statsMap[res.questionIndex].optionBreakdown[opt] = (statsMap[res.questionIndex].optionBreakdown[opt] || 0) + 1

      if (res.isCorrect) {
        statsMap[res.questionIndex].correctCount++
      }
    })
  })

  return {
    totalAttempts: results.length,
    questionStats: Object.values(statsMap).sort((a, b) => a.questionIndex - b.questionIndex),
  }
}
