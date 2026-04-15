"use client"

import Image from "next/image"

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex h-screen w-screen cursor-pointer items-center justify-center overflow-hidden bg-[#002D54]"
      onClick={onStart}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/startScreen/startScreenBG.png"
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
            src="/startScreen/startScreen.png"
            alt="The Zero Bleeds Challenge"
            width={1920}
            height={1080}
            className="h-auto max-h-[70vh] w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            priority
          />
        </div>

        <div className="mt-8 flex justify-center">
          <div className="animate-pulse rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold tracking-wider text-white uppercase backdrop-blur-md">
            Tap anywhere to begin
          </div>
        </div>
      </div>
    </div>
  )
}
