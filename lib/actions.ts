"use server";

import fs from "fs/promises";
import path from "path";
import type { QuizAttempt } from "./questions";

const RESULTS_FILE = path.join(process.cwd(), "results.json");

async function readResults(): Promise<QuizAttempt[]> {
  try {
    const data = await fs.readFile(RESULTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveQuizAttempt(attempt: QuizAttempt): Promise<void> {
  const results = await readResults();
  results.push(attempt);
  await fs.writeFile(RESULTS_FILE, JSON.stringify(results, null, 2), "utf-8");
}

export async function getResultsData(): Promise<string> {
  try {
    const data = await fs.readFile(RESULTS_FILE, "utf-8");
    return data;
  } catch {
    return "[]";
  }
}
