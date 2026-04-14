"use client";

import { Coin } from "@/components/ui/coin";
import type { QuestionResult } from "@/lib/questions";
import { RotateCcw } from "lucide-react";

interface FeedbackScreenProps {
  result: QuestionResult;
  questionText: string;
  explanation: string;
  refs: string[];
  questionNumber: number;
  totalQuestions: number;
  onNext: () => void;
  onRestart: () => void;
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
  const isCorrect = result.isCorrect;
  const letterLabels = ["A", "B", "C", "D"];

  return (
    <div className="quiz-layout">
      {/* Background decorations */}
      <div className="blood-drop-decoration blood-drop-1" />
      <div className="blood-drop-decoration blood-drop-2" />
      <div className="blood-drop-decoration blood-drop-3" />
      <div className="blood-drop-decoration blood-drop-4" />
      <div className="blood-drop-decoration blood-drop-5" />

      {/* Top left Q badge */}
      <div className="q-badge">
        Q{questionNumber}
      </div>

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
          <div
            className="progress-fill"
            style={{
              width: `${(questionNumber / totalQuestions) * 100}%`,
            }}
          />
        </div>
        <span className="progress-text">
          {questionNumber}/{totalQuestions}
        </span>
      </div>

      {/* Main feedback card */}
      <div className="feedback-card-container">
        <div
          className={`feedback-card ${isCorrect ? "feedback-correct" : "feedback-incorrect"}`}
        >
          {/* Restart button */}
          <button
            onClick={onRestart}
            className="restart-button"
            type="button"
          >
            <RotateCcw size={16} />
            <span>Restart</span>
          </button>

          <div className="feedback-content">
            <div className="feedback-text-section">
              <h2 className={`feedback-title ${isCorrect ? "text-correct" : "text-incorrect"}`}>
                {isCorrect ? "Correct!" : "Not Quite!"}
              </h2>
              <p className="feedback-explanation">{explanation}</p>
              {!isCorrect && (
                <p className="correct-answer-label">
                  Correct answer: {letterLabels[result.correctAnswer]}
                </p>
              )}
            </div>
            <div className="feedback-coin-section">
              <div className={`coin-glow ${isCorrect ? "coin-glow-gold" : "coin-glow-silver"}`}>
                <Coin variant={isCorrect ? "gold" : "silver"} size={120} />
              </div>
            </div>
          </div>

          {/* Next button */}
          <div className="feedback-actions">
            <button
              onClick={onNext}
              className="next-button"
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* References */}
      <div className="refs-container">
        {refs.map((ref, i) => (
          <p key={i} className="ref-text">
            {i + 1}. {ref}
          </p>
        ))}
      </div>
    </div>
  );
}
