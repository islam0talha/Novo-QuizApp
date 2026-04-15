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

      {/* Top bar: Q badge + Progress bar + Logo area */}
      <div className="relative z-10 flex w-full items-center px-6 pt-3">
        {/* Q Badge - top left */}
        <div className="text-[2.5rem] leading-none font-black text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.4)]">
          Q{currentIndex + 1}
        </div>

        {/* Progress bar - centered, compact */}
        <div className="flex flex-1 items-center justify-center px-8">
          <div className="flex w-full max-w-[260px] items-center gap-3">
            <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-[#1565C0] transition-all duration-500 ease-out"
                style={{
                  width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                }}
              />
            </div>
            <span className="text-sm font-bold whitespace-nowrap text-white">
              {currentIndex + 1}/{totalQuestions}
            </span>
          </div>
        </div>

        {/* Spacer for logo (already in BG image) */}
        <div className="w-20" />
      </div>

      {/* Main Content Area — fills remaining space */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-[2%] pb-1">
        {/* Question Card — use actual card aspect ratio (2:1) so image fills perfectly */}
        <div
          className="relative max-h-screen w-full max-w-[1600px]"
          style={{ aspectRatio: "2/1" }}
        >
          <Image
            src="/quetionsScreen/questionCard.png"
            alt="Question Card"
            fill
            className="object-contain"
          />

          {/* Content overlay — absolute positioning for precise alignment with background assets */}

          {/* Question Text Block — Center-aligned vertically with the blood drop illustration */}
          <div className="absolute top-[26%] right-[32%] left-[8%] z-20 flex items-start gap-5 lg:gap-8">
            <span className="shrink-0 text-6xl leading-none font-black text-[#C62828] lg:text-7xl xl:text-8xl">
              {currentIndex + 1}
            </span>
            <h2 className="flex-1 pt-3 text-lg leading-tight font-extrabold text-[#002D54] lg:text-2xl xl:text-3xl">
              {currentQuestion.q}
            </h2>
          </div>

          {/* Answer Options Grid — Positioned in the lower section of the white area */}
          <div className="absolute right-[8%] bottom-[10%] left-[8%] z-20 grid grid-cols-2 gap-x-6 gap-y-3 lg:gap-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className="group relative transition-transform hover:scale-[1.01] active:scale-[0.99]"
                type="button"
              >
                <div
                  className="relative flex w-full items-center"
                  style={{ height: "clamp(40px, 6vh, 64px)" }}
                >
                  <Image
                    src="/quetionsScreen/answerCard.png"
                    alt=""
                    fill
                    className={`object-fill transition-all ${
                      selectedOption === index
                        ? "opacity-100 brightness-110"
                        : "opacity-90 group-hover:opacity-100"
                    }`}
                  />
                  {/* Selection ring */}
                  {selectedOption === index && (
                    <div className="absolute inset-0.5 z-20 rounded-md border-2 border-[#1565C0] shadow-[0_0_15px_rgba(21,101,192,0.3)]" />
                  )}
                  <div className="relative z-30 flex w-full items-center px-6">
                    <span
                      className={`mr-3 shrink-0 text-base font-black lg:text-lg ${
                        selectedOption === index
                          ? "text-[#1565C0]"
                          : "text-[#002D54]"
                      }`}
                    >
                      {letterLabels[index]}.
                    </span>
                    <span className="text-left text-sm font-semibold text-[#002D54] lg:text-base">
                      {option}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Button — right-aligned, below card */}
        <div className="mt-2 flex w-full max-w-[1200px] justify-end">
          <button
            onClick={handleConfirm}
            disabled={selectedOption === null}
            className={`rounded-full border-2 px-8 py-2 text-sm font-bold transition-all duration-300 ${
              selectedOption === null
                ? "cursor-not-allowed border-white/30 bg-transparent text-white/30"
                : "border-white bg-transparent text-white shadow-lg hover:-translate-y-0.5 hover:bg-white hover:text-[#002D54]"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>

      {/* References Footer */}
      <div className="relative z-10 w-full px-6 pt-1 pb-3">
        <div className="flex flex-wrap gap-x-4 text-[10px] leading-relaxed text-white/50 italic">
          {currentQuestion.refs.map((ref, i) => (
            <span key={i}>
              {i + 1}. {ref}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
