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
    setPhase("start")
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
          src="/quetionsScreen/questionsBG.webp"
          alt="Background"
          fill
          className="object-fit"
          priority
        />
      </div>

      {/* Top bar: Q badge + Progress bar + Logo area */}
      <div className="relative z-30">
        {/* Q Badge - Centered deeper within the top-left blood splash */}
        <div className="absolute top-[6vh] left-[8vw] z-30 text-6xl font-black text-white italic drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] lg:text-7xl xl:text-8xl">
          Q{currentIndex + 1}
        </div>

        {/* Progress Bar - Large, centered vertically with the logo, starts after the blood splash */}
        <div className="absolute top-[5vh] right-[22%] left-[22%] z-30 flex items-center gap-4">
          <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-[#3D3D3D]/40 backdrop-blur-sm lg:h-4">
            <div
              className="h-full rounded-full bg-[#1565C0] shadow-[0_0_15px_rgba(21,101,192,0.5)] transition-all duration-700 ease-out"
              style={{
                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
          <span className="text-base font-black text-white drop-shadow-md lg:text-lg">
            {currentIndex + 1}/{totalQuestions}
          </span>
        </div>
      </div>

      {/* Main Content Area — shifted downward for better balance */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-start px-[2%] pt-[20vh]">
        {/* Question Card — use actual card aspect ratio (2:1) so image fills perfectly */}
        <div
          className="relative max-h-[70vh] w-full max-w-[1550px]"
          style={{ aspectRatio: "2/1" }}
        >
          <Image
            src="/quetionsScreen/questionCard.webp"
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

          {/* Answer Options Grid — Taller, narrower cards to allow text wrapping */}
          <div className="absolute right-[10%] bottom-[18%] left-[10%] z-20 grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-4 lg:gap-x-10 lg:gap-y-5 xl:gap-x-12">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className="group relative h-28 w-full transition-transform hover:scale-[1.02] active:scale-[0.98] lg:h-28 xl:h-32"
                type="button"
              >
                <Image
                  src="/quetionsScreen/answerCard.webp"
                  alt=""
                  fill
                  className="object-fill opacity-100 transition-all"
                />

                <div className="relative z-30 flex h-full w-full items-center px-8 lg:px-10">
                  <span
                    className={`mr-4 shrink-0 text-xl font-black lg:text-2xl xl:text-3xl ${
                      selectedOption === index
                        ? "text-[#E31B23]"
                        : "text-[#002D54]"
                    }`}
                  >
                    {letterLabels[index]}.
                  </span>
                  <span
                    className={`text-left text-base leading-tight font-bold lg:text-lg xl:text-xl ${
                      selectedOption === index
                        ? "text-[#E31B23]"
                        : "text-[#002D54]"
                    }`}
                  >
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Button Area — Shifted to the left relative to previous position */}
        <div className="mt-2 flex w-full max-w-[1550px] justify-start pl-[50%]">
          <button
            onClick={handleConfirm}
            disabled={selectedOption === null}
            className={`relative h-12 w-48 transition-all active:scale-95 lg:h-14 lg:w-56 ${
              selectedOption === null
                ? "cursor-not-allowed opacity-40 grayscale"
                : "drop-shadow-xl hover:-translate-y-1 hover:brightness-110"
            }`}
          >
            <Image
              src="/quetionsScreen/confirmButton.webp"
              alt="Confirm"
              fill
              className="object-contain"
            />
          </button>
        </div>
      </div>

      {/* References Footer */}
      <div className="relative z-10 w-full px-8 pb-4">
        <div className="flex flex-col gap-x-6 text-[11px] leading-relaxed text-white/40 italic lg:text-xs">
          {currentQuestion.refs.map((ref, i) => (
            <span key={i}>{ref}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
