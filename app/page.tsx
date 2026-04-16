import { QuizApp } from "@/components/quiz/quiz-app";
import { PasswordGate } from "@/components/quiz/password-gate";

export default function Page() {
  return (
    <PasswordGate>
      <QuizApp />
    </PasswordGate>
  );
}
