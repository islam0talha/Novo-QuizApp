"use client"

import Image from "next/image"
import type { QuestionResult } from "@/lib/questions"

interface FeedbackScreenProps {
  result: QuestionResult
  questionText: string
  explanation: string
  refs: string[]
  questionNumber: number
  totalQuestions: number
  onNext: () => void
  onRestart: () => void
}

export function FeedbackScreen({
  result,
  explanation,
  refs,
  questionNumber,
  totalQuestions,
  onNext,
  onRestart,
}: FeedbackScreenProps) {
  const isCorrect = result.isCorrect
  const letterLabels = ["A", "B", "C", "D"]

  return (
    <div className="font-outfit fixed inset-0 flex h-screen w-screen flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/answerScreen/Correct&WrongBG.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Top bar: Q badge + Progress bar (Mirrors quiz-app.tsx for consistency) */}
      <div className="relative z-30">
        {/* Q Badge - Centered deeper within the top-left blood splash */}
        <div className="absolute top-[6vh] left-[8vw] z-30 text-6xl font-black text-white italic drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] lg:text-7xl xl:text-8xl">
          Q{questionNumber}
        </div>

        {/* Progress Bar - Large, centered vertically, starts after the blood splash */}
        <div className="absolute top-[5vh] right-[22%] left-[22%] z-30 flex items-center gap-4">
          <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-[#3D3D3D]/40 backdrop-blur-sm lg:h-4">
            <div
              className="h-full rounded-full bg-[#1565C0] shadow-[0_0_15px_rgba(21,101,192,0.5)] transition-all duration-700 ease-out"
              style={{
                width: `${(questionNumber / totalQuestions) * 100}%`,
              }}
            />
          </div>
          <span className="text-base font-black text-white drop-shadow-md lg:text-lg">
            {questionNumber}/{totalQuestions}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 -mt-12 flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-6xl flex-col items-center px-8">
          {/* Feedback Card */}
          <div className="relative flex aspect-[16/8] w-full items-center justify-center">
            <Image
              src={
                isCorrect
                  ? "/answerScreen/correctAnswerCard.png"
                  : "/answerScreen/WrongAnswerCard.png"
              }
              alt="Feedback Card"
              fill
              className="object-contain"
              priority
            />

            {/* Overlay Content */}
            <div className="relative z-20 flex w-full items-center pr-[35%] pl-[12%]">
              <div className="flex flex-col gap-4">
                <h2
                  className={`text-6xl font-black tracking-tighter italic ${isCorrect ? "text-[#FFD700]" : "text-white"}`}
                >
                  {isCorrect ? "CORRECT!" : "NOT QUITE!"}
                </h2>
                <p className="max-w-xl text-2xl leading-tight font-bold text-white">
                  {explanation}
                </p>
                {!isCorrect && (
                  <div className="mt-2 inline-block self-start rounded-lg border border-white/20 bg-white/10 px-6 py-2">
                    <span className="mr-2 font-black tracking-wide text-[#FFD700] uppercase">
                      Correct Answer:
                    </span>
                    <span className="text-xl font-black text-white">
                      {letterLabels[result.correctAnswer]}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Restart Button (using the provided asset if suitable, or a custom one) */}
            <button
              onClick={onRestart}
              className="group absolute top-[15%] right-[5%] z-30 transition-transform hover:rotate-12"
              type="button"
            >
              <div className="relative h-16 w-16">
                <Image
                  src="/answerScreen/restartButton.png"
                  alt="Restart"
                  fill
                  className="object-contain"
                />
              </div>
            </button>
          </div>

          {/* Next Button */}
          <div className="mt-12">
            <button
              onClick={onNext}
              className="rounded-full bg-[#E53935] px-24 py-5 text-3xl font-black text-white shadow-2xl transition-all hover:-translate-y-1 hover:bg-[#C62828] active:scale-95"
              type="button"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>

      {/* References Footer */}
      <div className="relative z-10 flex w-full flex-wrap justify-center gap-x-8 bg-black/10 p-8 text-sm text-white/70 italic backdrop-blur-sm">
        {refs.map((ref, i) => (
          <span key={i}>
            [{i + 1}] {ref}
          </span>
        ))}
      </div>
    </div>
  )
}
