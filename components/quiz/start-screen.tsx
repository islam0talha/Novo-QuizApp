"use client"

import { useEffect, useState } from "react"
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
  const [loadedCount, setLoadedCount] = useState(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let count = 0
    const total = ALL_ASSETS.length

    const handleAssetLoad = () => {
      count++
      setLoadedCount(count)
      if (count === total) {
        // Add a small delay for perception of "preparing"
        setTimeout(() => setIsReady(true), 500)
      }
    }

    ALL_ASSETS.forEach((asset) => {
      // Use window.Image to avoid conflict with Next.js Image component import
      const img = new window.Image()
      img.src = asset
      img.onload = handleAssetLoad
      img.onerror = handleAssetLoad // Count as loaded even on error to prevent being stuck
    })
  }, [])

  const progress = Math.round((loadedCount / ALL_ASSETS.length) * 100)

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

        <div className="mt-8 flex h-24 w-full items-center justify-center">
          {!isReady ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-bold tracking-widest text-white/60 uppercase">
                Preparing Challenge... {progress}%
              </span>
            </div>
          ) : (
            <button
              onClick={onStart}
              className="group relative h-20 w-80 transform animate-in transition-transform duration-500 fade-in zoom-in active:scale-95 md:h-24 md:w-96"
            >
              <Image
                src="/startScreen/slide 1-0٢.webp"
                alt="Start Quiz"
                fill
                className="object-contain"
                priority
              />
              <div className="absolute inset-0 rounded-full bg-white/0 transition-colors group-hover:bg-white/5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
