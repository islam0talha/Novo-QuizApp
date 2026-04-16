"use client"

import { useState, useEffect } from "react"
import { getQuizStats, resetQuizStats, type QuestionStats } from "@/lib/actions"
import { questions } from "@/lib/questions"
import Link from "next/link"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [stats, setStats] = useState<{ totalAttempts: number, questionStats: QuestionStats[] } | null>(null)
  const [isResetting, setIsResetting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Separate admin credentials
  const ADMIN_USER = "admin"
  const ADMIN_PASS = "admin2026"

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth")
    if (auth === "true") {
      setIsAuthenticated(true)
      fetchStats()
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  const fetchStats = async () => {
    const data = await getQuizStats()
    setStats(data)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem("admin-auth", "true")
      setIsAuthenticated(true)
      fetchStats()
    } else {
      setError(true)
      setPassword("")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin-auth")
    setIsAuthenticated(false)
  }

  const handleResetData = async () => {
    setIsResetting(true)
    try {
      await resetQuizStats()
      await fetchStats()
      setShowConfirm(false)
    } catch (err) {
      console.error("Failed to reset stats:", err)
    } finally {
      setIsResetting(false)
    }
  }

  if (isAuthenticated === null) return null

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 font-sans">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="mb-6 text-2xl font-bold text-slate-900 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500 italic">Invalid credentials</p>}
            <button type="submit" className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-slate-50 overflow-y-auto font-sans">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Quiz Statistics</h1>
            <p className="text-slate-500">Total Quiz Completions: <span className="font-bold text-slate-700">{stats?.totalAttempts || 0}</span></p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowConfirm(true)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700"
            >
              Reset Data
            </button>
            <Link href="/api/download-results" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
              Download Full JSON
            </Link>
            <button onClick={handleLogout} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
              Logout
            </button>
            <Link href="/" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
              Back to Quiz
            </Link>
          </div>
        </header>

        <div className="grid gap-8">
          {stats?.questionStats.map((q) => {
            const questionData = questions[q.questionIndex]
            if (!questionData) return null
            const correctPercent = q.totalAttempts > 0 ? Math.round((q.correctCount / q.totalAttempts) * 100) : 0

            return (
              <div key={q.questionIndex} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="bg-slate-50/80 p-6 border-b border-slate-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Question {q.questionIndex + 1}</span>
                      <h2 className="mt-1 text-lg font-semibold text-slate-800 leading-snug">{q.questionText}</h2>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-2xl font-bold text-blue-600 leading-none">{correctPercent}%</div>
                      <div className="mt-1 text-[10px] uppercase font-bold text-slate-400">Success Rate</div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="mb-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Detailed Answer Breakdown</h3>
                  <div className="space-y-5">
                    {questionData.options.map((option, idx) => {
                      const count = q.optionBreakdown[idx] || 0
                      const percent = q.totalAttempts > 0 ? Math.round((count / q.totalAttempts) * 100) : 0
                      const isCorrect = idx === questionData.correct

                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-start gap-3">
                              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-black ${isCorrect ? 'bg-green-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <div className="flex flex-col">
                                <span className={`${isCorrect ? "font-bold text-slate-900" : "text-slate-600 font-medium"} text-sm`}>{option}</span>
                                {isCorrect && <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest mt-0.5">Correct Answer</span>}
                              </div>
                            </div>
                            <span className="font-mono text-xs font-bold text-slate-400 shrink-0">{count} responses ({percent}%)</span>
                          </div>
                          <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div 
                              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${isCorrect ? 'bg-green-500' : 'bg-slate-300'}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-2 text-xl font-bold text-slate-900">Are you sure?</h2>
            <p className="mb-6 text-slate-600">This will permanently delete all collected quiz results and reset statistics to zero. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                disabled={isResetting}
                className="flex-1 rounded-lg border border-slate-300 bg-white py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleResetData}
                disabled={isResetting}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isResetting ? "Resetting..." : "Yes, Reset All"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
