import React from "react";
import Question from "./question";
import type { IRenderedQuiz, QuestionType } from "../features/quiz/types";

type QuizUpdateProps = {
  /** renderQuiz + id del quiz */
  quizData: (IRenderedQuiz & { id: number });
  /** eliminar un bloque de pregunta (por índice local) */
  onDelete: (draftId: number) => void;
  /** registrar la función de guardado de una pregunta */
  onRegister: (draftId: number, saveFn: () => Promise<void>) => void;
  /** desregistrar al eliminar o desmontar */
  onUnregister: (draftId: number) => void;
};

const QuizUpdate: React.FC<QuizUpdateProps> = ({
  quizData,
  onDelete,
  onRegister,
  onUnregister,
}) => {
  const quizId = quizData.id;
  const items = quizData.question ?? [];

  return (
    <section className="w-full rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-indigo-900">{quizData.title}</h1>
        <p className="mt-1 text-sm text-slate-600">
          Reconstruye las preguntas del cuestionario. Cuando termines, el padre puede ejecutar todas las guardas.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
          Este quiz no tiene preguntas para reconstruir.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {items.map((q, idx) => {
            // Usamos un id local estable por posición (1..n).
            // Si prefieres, puedes usar q.id si lo tienes.
            const draftId = idx + 1;
            const type = (q.type as QuestionType) ?? "multiple_choice";

            return (
              <div key={`${type}-${draftId}`} className="rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Pregunta #{draftId} — {type === "true_false" ? "V/F" : type === "multiple_choice" ? "Múltiple" : "Completar"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(draftId);
                      onUnregister(draftId);
                    }}
                    className="rounded-lg bg-rose-50 px-2 py-1 text-sm font-medium text-rose-700 hover:bg-rose-100"
                  >
                    Quitar
                  </button>
                </div>

                <Question
                  id={draftId}
                  type={type}
                  quizId={quizId}
                  onDelete={() => {
                    onDelete(draftId);
                    onUnregister(draftId);
                  }}
                  onRegister={onRegister}
                  onUnregister={onUnregister}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default QuizUpdate;
