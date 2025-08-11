import React from "react";
import type { IRenderedQuiz, QuestionType } from "../features/quiz/types"; // ajusta la ruta si es distinta

type Props = { quizData: IRenderedQuiz };

const TYPE_LABEL: Record<QuestionType, string> = {
  true_false: "Verdadero/Falso",
  multiple_choice: "Opción múltiple",
  fill_in_the_blank: "Completar",
};

const QuizForm: React.FC<Props> = ({ quizData }) => {
  const questions = quizData?.question ?? [];

  return (
    <section className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-indigo-900">{quizData.title}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {questions.length} pregunta{questions.length === 1 ? "" : "s"}
        </p>
      </header>

      <ol className="space-y-6">
        {questions.map((q, qi) => (
          <li key={`${q.text}-${qi}`} className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-800">
                {qi + 1}. {q.text}
              </h2>
              <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                {TYPE_LABEL[(q.type as QuestionType)] ?? q.type}
              </span>
            </div>

            {q.type === "fill_in_the_blank" ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
                {q.answers?.[0]?.text ?? "—"}
              </div>
            ) : (
              <ul className="space-y-2">
                {(q.answers ?? []).map((a, ai) => (
                  <li key={`${a.text}-${ai}`} className="flex items-center gap-2">
                    {q.type === "true_false" ? (
                      <input type="radio" disabled checked={!!a.correct} className="size-4" />
                    ) : (
                      <input type="checkbox" disabled checked={!!a.correct} className="size-4" />
                    )}
                    <span
                      className={`text-sm ${a.correct ? "font-semibold text-emerald-700" : "text-slate-700"
                        }`}
                    >
                      {a.text}
                    </span>
                    {a.correct && (
                      <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Correcta
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
};

export default QuizForm;
