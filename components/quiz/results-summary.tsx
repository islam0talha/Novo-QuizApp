"use client"

import Image from "next/image"
import type { QuestionResult } from "@/lib/questions"
import { Download, RotateCcw } from "lucide-react"

interface ResultsSummaryProps {
  results: QuestionResult[]
  totalQuestions: number
  onRestart: () => void
}

export function ResultsSummary({
  results,
  totalQuestions,
  onRestart,
}: ResultsSummaryProps) {
  const correctCount = results.filter((r) => r.isCorrect).length

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/download-results")
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "quiz-results.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden flex flex-col font-outfit">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/quetionsScreen/questionsBG.png"
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
            <div className="h-full bg-white w-full" />
          </div>
          <span className="text-white font-bold text-xl min-w-[60px]">
            {totalQuestions}/{totalQuestions}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-8">
        <div className="w-full max-w-4xl px-8 flex flex-col items-center">
          
          <h1 className="text-6xl font-black text-white italic tracking-tighter mb-8 drop-shadow-xl">
            FINAL RESULTS
          </h1>

          {/* Results Card */}
          <div className="relative w-full aspect-[21/10] flex items-center justify-center p-12">
            <Image
              src="/resultScreen/ResultCard.png"
              alt="Result Card"
              fill
              className="object-contain"
            />
            
            <div className="relative z-20 w-full flex flex-col items-center px-24">
               <div className="text-center mb-8">
                  <span className="text-2xl font-bold text-[#002D54] opacity-70 uppercase tracking-widest">Your Score</span>
                  <div className="text-8xl font-black text-[#E53935]">
                    {correctCount}<span className="text-4xl text-[#002D54]/30 mx-2">/</span>{totalQuestions}
                  </div>
               </div>

               {/* Coin Grid */}
               <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
                 {results.map((result, index) => (
                   <div key={index} className="relative group flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="relative w-16 h-16 drop-shadow-lg">
                        <Image
                          src={result.isCorrect ? "/resultScreen/CorrectCoin.png" : "/resultScreen/wrongCoin.png"}
                          alt={`Q${index+1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="mt-1 text-[10px] font-black text-[#002D54]/50">Q{index + 1}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-6 mt-12">
            <button
              onClick={onRestart}
              className="flex items-center gap-3 px-12 py-4 bg-white text-[#002D54] rounded-full text-xl font-black hover:bg-gray-100 transition-all active:scale-95 shadow-xl"
            >
              <RotateCcw size={24} />
              RESTART
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-3 px-12 py-4 bg-[#E53935] text-white rounded-full text-xl font-black hover:bg-[#C62828] transition-all active:scale-95 shadow-xl"
            >
              <Download size={24} />
              DOWNLOAD
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
