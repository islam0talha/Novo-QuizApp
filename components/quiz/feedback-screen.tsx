"use client"

import Image from "next/image"
import type { QuestionResult } from "@/lib/questions"
import { cn } from "@/lib/utils"

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
          className="object-fit"
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

      {/* Main Content Area — Locked to 1920x1080 logical centering */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-start px-[2%] pt-[25vh]">
        <div
          className="relative max-h-[65vh] w-full max-w-[1550px]"
          style={{ aspectRatio: "2/1" }}
        >
          {/* Feedback Card Asset */}
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

          {/* Absolute Content Overlays */}

          {/* Restart Button - Top Left of white area */}
          <button
            onClick={onRestart}
            className="group absolute top-[6%] left-[12%] z-30 flex items-center gap-2 transition-transform active:scale-95"
            type="button"
          >
            <div className="relative overflow-hidden">
              <Image
                src={
                  isCorrect
                    ? "/answerScreen/restartButton2.png"
                    : "/answerScreen/restartButton.png"
                }
                alt="Restart"
                height={200}
                width={200}
                className="object-contain"
              />
            </div>
          </button>

          {/* Feedback Content Area */}
          <div className="absolute top-[22%] right-[30%] left-[12%] z-20 flex flex-col gap-10 lg:gap-10">
            <h2
              className={cn(
                "text-6xl font-black tracking-tight italic lg:text-7xl xl:text-8xl",
                isCorrect ? "text-[#002D54]" : "text-white"
              )}
            >
              {isCorrect ? "Correct!" : "Not Quite!"}
            </h2>
            <p
              className={cn(
                "max-w-2xl text-xl leading-tight font-bold lg:text-2xl xl:text-4xl",
                isCorrect ? "text-[#002D54]" : "text-white"
              )}
            >
              {explanation}
            </p>

            {!isCorrect && result.correctAnswer !== undefined && (
              <div
                className={cn(
                  "mt-2 text-lg font-black tracking-widest uppercase lg:text-4xl",
                  isCorrect ? "text-[#002D54]" : "text-white"
                )}
              >
                Correct Answer: {letterLabels[result.correctAnswer]}
              </div>
            )}
          </div>

          {/* Coin / Illustration - Anchored to the right side of the card */}
          {/* (The coin is already part of the card assets in some versions, but we ensure spacing is clear) */}

          {/* Next Button - Anchored to the bottom-right of the white card */}
          <button
            onClick={onNext}
            className="absolute right-[12%] bottom-[5%] z-30 drop-shadow-xl transition-all hover:scale-105 active:scale-95"
            type="button"
          >
            <div className="relative h-12 w-40 lg:h-14 lg:w-48 xl:h-16 xl:w-56">
              <Image
                src="/answerScreen/nextButton.png"
                alt="Next"
                fill
                className="object-contain"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Footer — Matched with quiz-app.tsx */}
      <div className="relative z-10 w-full px-8 pb-4">
        <div className="flex flex-col gap-x-6 text-[11px] leading-relaxed text-white/40 italic lg:text-xs">
          {refs.map((ref, i) => (
            <span key={i}>
              {i + 1}. {ref}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
