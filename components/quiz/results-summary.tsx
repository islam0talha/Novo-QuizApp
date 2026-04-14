"use client";

import { Coin } from "@/components/ui/coin";
import type { QuestionResult } from "@/lib/questions";
import { Download, RotateCcw } from "lucide-react";

interface ResultsSummaryProps {
  results: QuestionResult[];
  totalQuestions: number;
  onRestart: () => void;
}

export function ResultsSummary({
  results,
  totalQuestions,
  onRestart,
}: ResultsSummaryProps) {
  const correctCount = results.filter((r) => r.isCorrect).length;

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/download-results");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quiz-results.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="quiz-layout">
      {/* Background decorations */}
      <div className="blood-drop-decoration blood-drop-1" />
      <div className="blood-drop-decoration blood-drop-2" />
      <div className="blood-drop-decoration blood-drop-3" />
      <div className="blood-drop-decoration blood-drop-4" />
      <div className="blood-drop-decoration blood-drop-5" />

      {/* Novo Nordisk logo placeholder */}
      <div className="novo-logo">
        <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="30" r="14" stroke="white" strokeWidth="3" fill="none" />
          <path d="M36 30 C36 30 42 50 50 50 C58 50 64 30 64 30" stroke="white" strokeWidth="3" fill="none" />
          <path d="M30 55 L50 75 L70 55" stroke="white" strokeWidth="3" fill="none" />
          <line x1="50" y1="50" x2="50" y2="75" stroke="white" strokeWidth="3" />
        </svg>
        <span className="novo-logo-text">novo nordisk®</span>
      </div>

      {/* Progress bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "100%" }} />
        </div>
        <span className="progress-text">
          {totalQuestions}/{totalQuestions}
        </span>
      </div>

      {/* Title */}
      <div className="summary-header">
        <h1 className="summary-title">Total Score</h1>
        <p className="summary-subtitle">
          You got {correctCount} out of {totalQuestions} correct!
        </p>
      </div>

      {/* Coin grid */}
      <div className="summary-card">
        <div className="coin-grid">
          {results.map((result, index) => (
            <div
              key={index}
              className="coin-grid-item"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Coin
                variant={result.isCorrect ? "gold" : "silver"}
                size={75}
              />
              <span className="coin-question-label">Q{index + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="summary-actions">
        <button onClick={onRestart} className="summary-btn summary-btn-restart" type="button">
          <RotateCcw size={18} />
          <span>Restart Quiz</span>
        </button>
        <button onClick={handleDownload} className="summary-btn summary-btn-download" type="button">
          <Download size={18} />
          <span>Download Results</span>
        </button>
      </div>
    </div>
  );
}
