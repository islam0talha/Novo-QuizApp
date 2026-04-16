"use client"

import { useEffect } from "react"
import Image from "next/image"

interface StartScreenProps {
  onStart: () => void
}

const ALL_ASSETS = [
  "/startScreen/startScreenBG.webp",
  "/startScreen/startScreen.webp",
  "/startScreen/slide 1-0٢.webp",
  "/answerScreen/Correct&WrongBG.webp",
  "/answerScreen/correctAnswerCard.webp",
  "/answerScreen/nextButton.webp",
  "/answerScreen/restartButton.webp",
  "/answerScreen/restartButton2.webp",
  "/answerScreen/WrongAnswerCard.webp",
  "/quetionsScreen/answerCard.webp",
  "/quetionsScreen/confirmButton.webp",
  "/quetionsScreen/questionCard.webp",
  "/quetionsScreen/questionsBG.webp",
  "/resultScreen/CorrectCoin.webp",
  "/resultScreen/ResultCard.webp",
  "/resultScreen/wrongCoin.webp",
]

export function StartScreen({ onStart }: StartScreenProps) {
  useEffect(() => {
    // Pre-cache all images
    ALL_ASSETS.forEach((asset) => {
      const img = new (window as any).Image()
      img.src = asset
    })
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center overflow-hidden bg-[#002D54]">
      {/* Background Image */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/startScreen/startScreenBG.webp"
          alt="Background"
          fill
          className="object-fit"
          priority
        />
      </div>

      {/* Centered Start Content */}
      <div className="relative z-10 flex w-full max-w-[90vw] animate-in flex-col items-center p-6 duration-1000 fade-in zoom-in md:max-w-6xl md:p-12">
        <div className="relative flex w-full items-center justify-center overflow-hidden">
          <Image
            src="/startScreen/startScreen.webp"
            alt="The Zero Bleeds Challenge"
            width={1920}
            height={1080}
            className="h-auto max-h-[70vh] w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            priority
          />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onStart}
            className="relative h-20 w-80 transform transition-transform active:scale-95 md:h-24 md:w-96"
          >
            <Image
              src="/startScreen/slide 1-0٢.webp"
              alt="Start Quiz"
              fill
              className="object-contain"
              priority
            />
          </button>
        </div>
      </div>
    </div>
  )
}
