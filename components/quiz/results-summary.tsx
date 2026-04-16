"use client"

import Image from "next/image"
import type { QuestionResult } from "@/lib/questions"

interface ResultsSummaryProps {
  results: QuestionResult[]
  totalQuestions: number
  onRestart: () => void
}

export function ResultsSummary({ results, onRestart }: ResultsSummaryProps) {
  // Global click handler to restart the quiz
  const handleGlobalClick = () => {
    onRestart()
  }

  return (
    <div
      className="font-outfit fixed inset-0 flex h-screen w-screen cursor-pointer flex-col overflow-hidden"
      onClick={handleGlobalClick}
    >
      {/* Background (Using same consistent BG) */}
      <div className="absolute inset-0">
        <Image
          src="/answerScreen/Correct&WrongBG.webp"
          alt="Background"
          fill
          className="object-fit"
          priority
        />
      </div>

      {/* Top bar: Header Sync (Q11 + Progress Bar + Logo) */}
      <div className="relative z-30">
        {/* Progress Bar - Locked at 100% */}
        <div className="absolute top-[5vh] right-[22%] left-[22%] z-30 flex items-center gap-4">
          <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-[#3D3D3D]/40 backdrop-blur-sm lg:h-4">
            <div className="h-full w-full rounded-full bg-[#1565C0] shadow-[0_0_15px_rgba(21,101,192,0.5)] transition-all duration-700 ease-out" />
          </div>
          <span className="text-base font-black text-white drop-shadow-md lg:text-lg">
            11/11
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-start px-[2%] pt-[10vh]">
        <h1 className="mb-6 text-6xl font-black tracking-tight text-white italic drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] lg:text-7xl xl:text-8xl">
          Total Score
        </h1>

        {/* Expanded Results Card */}
        <div
          className="relative max-h-[60vh] w-full max-w-[1550px] drop-shadow-2xl"
          style={{ aspectRatio: "2/1" }}
        >
          <Image
            src="/resultScreen/ResultCard.webp"
            alt="Result Card"
            fill
            className="object-contain"
          />

          {/* Internal Content Overlays */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pt-8">
            {/* Minimalist Score Display (Optional, based on target design 1) */}

            {/* 11-Coin Grid - Balanced and centered */}
            <div className="grid grid-cols-6 gap-x-6 gap-y-8 px-[12%] lg:gap-x-10 lg:gap-y-12">
              {results.slice(0, 11).map((result, index) => (
                <div
                  key={index}
                  className="relative h-[200px] w-[200px] transform animate-in duration-500 fade-in zoom-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <Image
                    src={
                      result.isCorrect
                        ? "/resultScreen/CorrectCoin.webp"
                        : "/resultScreen/wrongCoin.webp"
                    }
                    alt={`Coin ${index + 1}`}
                    fill
                    className="object-contain drop-shadow-xl"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Interaction Instruction (Animated Pulse) */}
        <div className="mt-12 animate-pulse text-2xl font-black tracking-widest text-white/70 uppercase lg:text-3xl">
          Tap anywhere to restart
        </div>
      </div>
    </div>
  )
}
