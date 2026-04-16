"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface PasswordGateProps {
  children: React.ReactNode
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [error, setError] = useState(false)

  // Use a fixed password
  const FIXED_PASSWORD = "novo"

  useEffect(() => {
    // Check localStorage for previous authentication
    const authStatus = localStorage.getItem("quiz-auth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === FIXED_PASSWORD) {
      localStorage.setItem("quiz-auth", "true")
      setIsAuthenticated(true)
      setError(false)
    } else {
      setError(true)
      setPassword("")
    }
  }

  // Prevent flash while checking localStorage
  if (isAuthenticated === null) {
    return <div className="fixed inset-0 bg-[#002D54]" />
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#002D54] px-4">
      <div className="mb-8 relative w-48 h-24">
         <Image 
            src="/startScreen/startScreen.png" 
            alt="Logo" 
            fill 
            className="object-contain"
         />
      </div>
      
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl">
        <h2 className="mb-6 text-2xl font-bold text-center text-white">Enter Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-white/60"
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-400">Incorrect password. Please try again.</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-white py-3 font-semibold text-[#002D54] transition-colors hover:bg-white/90"
          >
            Access Quiz
          </button>
        </form>
      </div>
    </div>
  )
}
