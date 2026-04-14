"use client"

import { useState, useCallback } from "react"
import {
  questions,
  type QuestionResult,
  type QuizAttempt,
} from "@/lib/questions"
import { saveQuizAttempt } from "@/lib/actions"
import { FeedbackScreen } from "./feedback-screen"
import { ResultsSummary } from "./results-summary"

type Phase = "question" | "feedback" | "summary"

export function QuizApp() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [phase, setPhase] = useState<Phase>("question")
  const [results, setResults] = useState<QuestionResult[]>([])
  const [lastResult, setLastResult] = useState<QuestionResult | null>(null)

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const letterLabels = ["A", "B", "C", "D"]

  const handleConfirm = useCallback(() => {
    if (selectedOption === null) return

    const result: QuestionResult = {
      questionIndex: currentIndex,
      question: currentQuestion.q,
      selectedAnswer: selectedOption,
      correctAnswer: currentQuestion.correct,
      isCorrect: selectedOption === currentQuestion.correct,
    }

    setLastResult(result)
    setResults((prev) => [...prev, result])
    setPhase("feedback")
  }, [selectedOption, currentIndex, currentQuestion])

  const handleNext = useCallback(async () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedOption(null)
      setPhase("question")
    } else {
      // Quiz complete — save attempt
      const allResults = [...results]
      if (lastResult && allResults.length < totalQuestions) {
        // lastResult is already in results from handleConfirm
      }
      const attempt: QuizAttempt = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        totalQuestions,
        correctCount:
          results.filter((r) => r.isCorrect).length +
          (lastResult?.isCorrect ? 0 : 0),
        score: Math.round(
          (results.filter((r) => r.isCorrect).length / totalQuestions) * 100
        ),
        results: results,
      }
      try {
        await saveQuizAttempt(attempt)
      } catch (e) {
        console.error("Failed to save attempt:", e)
      }
      setPhase("summary")
    }
  }, [currentIndex, totalQuestions, results, lastResult])

  const handleRestart = useCallback(() => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setPhase("question")
    setResults([])
    setLastResult(null)
  }, [])

  // FEEDBACK SCREEN
  if (phase === "feedback" && lastResult) {
    return (
      <FeedbackScreen
        result={lastResult}
        questionText={currentQuestion.q}
        explanation={currentQuestion.explanation}
        refs={currentQuestion.refs}
        questionNumber={currentIndex + 1}
        totalQuestions={totalQuestions}
        onNext={handleNext}
        onRestart={handleRestart}
      />
    )
  }

  // SUMMARY SCREEN
  if (phase === "summary") {
    return (
      <ResultsSummary
        results={results}
        totalQuestions={totalQuestions}
        onRestart={handleRestart}
      />
    )
  }

  // QUESTION SCREEN
  return (
    <div className="quiz-layout">
      {/* Background decorations */}
      <div className="blood-drop-decoration blood-drop-1" />
      <div className="blood-drop-decoration blood-drop-2" />
      <div className="blood-drop-decoration blood-drop-3" />
      <div className="blood-drop-decoration blood-drop-4" />
      <div className="blood-drop-decoration blood-drop-5" />

      {/* Top left Q badge */}
      <div className="q-badge">Q{currentIndex + 1}</div>

      {/* Novo Nordisk logo */}
      <div className="novo-logo">
        <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
          <circle
            cx="50"
            cy="30"
            r="14"
            stroke="white"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M36 30 C36 30 42 50 50 50 C58 50 64 30 64 30"
            stroke="white"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M30 55 L50 75 L70 55"
            stroke="white"
            strokeWidth="3"
            fill="none"
          />
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="75"
            stroke="white"
            strokeWidth="3"
          />
        </svg>
        <span className="novo-logo-text">novo nordisk®</span>
      </div>

      {/* Progress bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </div>
        <span className="progress-text">
          {currentIndex + 1}/{totalQuestions}
        </span>
      </div>

      {/* Main question card */}
      <div className="question-card-container">
        <div className="question-card">
          {/* Decorative corner accents */}
          <div className="card-corner card-corner-tl" />
          <div className="card-corner card-corner-tr" />
          <div className="card-corner card-corner-bl" />
          <div className="card-corner card-corner-br" />

          <div className="question-content">
            <div className="question-header">
              <span className="question-number-large">{currentIndex + 1}</span>
              <h2 className="question-text">{currentQuestion.q}</h2>
            </div>

            {/* Medical icon */}
            <div className="question-icon">
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                <path
                  d="M50 10 C50 10 35 30 35 50 C35 65 42 75 50 75 C58 75 65 65 65 50 C65 30 50 10 50 10Z"
                  fill="#C62828"
                />
                <path
                  d="M50 10 C50 10 42 25 40 40 C38 50 44 60 50 62 C50 62 50 10 50 10Z"
                  fill="#E53935"
                  opacity="0.7"
                />
                <rect
                  x="70"
                  y="20"
                  width="4"
                  height="30"
                  rx="2"
                  fill="#C62828"
                />
                <rect
                  x="60"
                  y="30"
                  width="4"
                  height="25"
                  rx="2"
                  fill="#C62828"
                />
                <circle cx="72" cy="55" r="3" fill="#C62828" />
                <circle cx="62" cy="60" r="2" fill="#E53935" />
                <path
                  d="M68 18 L72 15 L76 18"
                  stroke="#C62828"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* Options grid */}
          <div className="options-grid">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`option-button ${selectedOption === index ? "option-selected" : ""}`}
                type="button"
              >
                <span className="option-letter">{letterLabels[index]}.</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm button */}
      <div className="confirm-container">
        <button
          onClick={handleConfirm}
          disabled={selectedOption === null}
          className="confirm-button"
          type="button"
        >
          Confirm
        </button>
      </div>

      {/* References */}
      <div className="refs-container">
        {currentQuestion.refs.map((ref, i) => (
          <p key={i} className="ref-text">
            {i + 1}. {ref}
          </p>
        ))}
      </div>
    </div>
  )
}
