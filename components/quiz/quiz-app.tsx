"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import {
  questions,
  type QuestionResult,
  type QuizAttempt,
} from "@/lib/questions"
import { saveQuizAttempt } from "@/lib/actions"
import { FeedbackScreen } from "./feedback-screen"
import { ResultsSummary } from "./results-summary"
import { StartScreen } from "./start-screen"

type Phase = "start" | "question" | "feedback" | "summary"

export function QuizApp() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [phase, setPhase] = useState<Phase>("start")
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

  const handleStart = useCallback(() => {
    setPhase("question")
  }, [])

  // START SCREEN
  if (phase === "start") {
    return <StartScreen onStart={handleStart} />
  }

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
    <div className="font-outfit fixed inset-0 flex h-screen w-screen flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/quetionsScreen/questionsBG.png"
          alt="Background"
          fill
          className="object-fit"
          priority
        />
      </div>

      {/* Progress bar */}
      <div className="relative z-10 mt-12 w-full px-12">
        <div className="flex items-center gap-4">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
            <div
              className="h-full bg-white transition-all duration-500 ease-out"
              style={{
                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
          <span className="min-w-[60px] text-xl font-bold text-white">
            {currentIndex + 1}/{totalQuestions}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 -mt-8 flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-7xl flex-col items-center px-8">
          {/* Question Card */}
          <div className="relative flex aspect-[21/9] w-full items-center justify-center p-12">
            <Image
              src="/quetionsScreen/questionCard.png"
              alt="Question Card"
              fill
              className="object-contain"
            />
            <div className="relative z-20 max-w-4xl px-20 text-center">
              <h2 className="text-3xl leading-tight font-extrabold text-[#002D54] md:text-4xl">
                {currentQuestion.q}
              </h2>
            </div>
          </div>

          {/* Options Grid */}
          <div className="mt-8 grid w-full max-w-5xl grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className="group relative transition-transform hover:scale-[1.02] active:scale-[0.98]"
                type="button"
              >
                <div className="relative flex h-24 w-full items-center">
                  <Image
                    src="/quetionsScreen/answerCard.png"
                    alt="Option BG"
                    fill
                    className={`object-contain transition-opacity ${selectedOption === index ? "opacity-100" : "opacity-80 group-hover:opacity-90"}`}
                  />
                  {/* Selection Glow */}
                  {selectedOption === index && (
                    <div className="absolute inset-x-8 inset-y-4 z-20 rounded-xl border-2 border-[#E53935]" />
                  )}
                  <div className="relative z-30 flex w-full items-center px-12">
                    <span
                      className={`mr-4 text-2xl font-black ${selectedOption === index ? "text-[#E53935]" : "text-[#002D54]"}`}
                    >
                      {letterLabels[index]}.
                    </span>
                    <span className="text-left text-xl font-bold text-[#002D54]">
                      {option}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Confirm Button */}
          <div className="mt-12">
            <button
              onClick={handleConfirm}
              disabled={selectedOption === null}
              className={`rounded-full px-16 py-4 text-2xl font-black transition-all duration-300 ${
                selectedOption === null
                  ? "cursor-not-allowed bg-gray-400 opacity-50"
                  : "bg-[#E53935] text-white shadow-xl hover:-translate-y-1 hover:bg-[#C62828] hover:shadow-2xl"
              }`}
            >
              CONFIRM
            </button>
          </div>
        </div>
      </div>

      {/* References Footer */}
      <div className="relative z-10 flex w-full flex-wrap justify-center gap-x-8 bg-black/10 p-8 text-sm text-white/70 italic backdrop-blur-sm">
        {currentQuestion.refs.map((ref, i) => (
          <span key={i}>
            [{i + 1}] {ref}
          </span>
        ))}
      </div>
    </div>
  )
}
