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
    <div className="fixed inset-0 w-screen h-screen overflow-hidden flex flex-col font-outfit">
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

      {/* Progress bar */}
      <div className="relative z-10 w-full mt-12 px-12">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-white transition-all duration-500 ease-out"
              style={{
                width: `${(questionNumber / totalQuestions) * 100}%`,
              }}
            />
          </div>
          <span className="text-white font-bold text-xl min-w-[60px]">
            {questionNumber}/{totalQuestions}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center -mt-12">
        <div className="w-full max-w-6xl px-8 flex flex-col items-center">
          
          {/* Feedback Card */}
          <div className="relative w-full aspect-[16/8] flex items-center justify-center">
            <Image
              src={isCorrect ? "/answerScreen/correctAnswerCard.png" : "/answerScreen/WrongAnswerCard.png"}
              alt="Feedback Card"
              fill
              className="object-contain"
              priority
            />
            
            {/* Overlay Content */}
            <div className="relative z-20 w-full flex items-center pl-[12%] pr-[35%]">
               <div className="flex flex-col gap-4">
                  <h2 className={`text-6xl font-black italic tracking-tighter ${isCorrect ? "text-[#FFD700]" : "text-white"}`}>
                    {isCorrect ? "CORRECT!" : "NOT QUITE!"}
                  </h2>
                  <p className="text-2xl font-bold text-white leading-tight max-w-xl">
                    {explanation}
                  </p>
                  {!isCorrect && (
                    <div className="mt-2 py-2 px-6 bg-white/10 rounded-lg inline-block self-start border border-white/20">
                         <span className="text-[#FFD700] font-black mr-2 uppercase tracking-wide">Correct Answer:</span>
                         <span className="text-white font-black text-xl">{letterLabels[result.correctAnswer]}</span>
                    </div>
                  )}
               </div>
            </div>

            {/* Restart Button (using the provided asset if suitable, or a custom one) */}
            <button 
              onClick={onRestart} 
              className="absolute top-[15%] right-[5%] z-30 group transition-transform hover:rotate-12"
              type="button"
            >
              <div className="relative w-16 h-16">
                <Image src="/answerScreen/restartButton.png" alt="Restart" fill className="object-contain" />
              </div>
            </button>
          </div>

          {/* Next Button */}
          <div className="mt-12">
             <button
               onClick={onNext}
               className="px-24 py-5 bg-[#E53935] text-white text-3xl font-black rounded-full shadow-2xl hover:bg-[#C62828] hover:-translate-y-1 transition-all active:scale-95"
               type="button"
             >
               NEXT
             </button>
          </div>
        </div>
      </div>

      {/* References Footer */}
      <div className="relative z-10 w-full p-8 text-white/70 text-sm italic flex flex-wrap gap-x-8 justify-center bg-black/10 backdrop-blur-sm">
        {refs.map((ref, i) => (
          <span key={i}>[{i + 1}] {ref}</span>
        ))}
      </div>
    </div>
  )
}
