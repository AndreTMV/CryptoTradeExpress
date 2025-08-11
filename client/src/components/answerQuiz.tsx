import React from "react";
import { toast } from "react-hot-toast";
import type { IRenderedQuiz, QuestionType } from "../features/quiz/types";

type Props = { quizData: IRenderedQuiz };

type UserAnswer =
  | { type: "true_false"; selected: number | null }           // índice de la respuesta elegida
  | { type: "multiple_choice"; selected: Set<number> }        // índices elegidos
  | { type: "fill_in_the_blank"; text: string };              // texto escrito

const normalise = (s: string) => s.trim().toLowerCase();

const QuizResult: React.FC<Props> = ({ quizData }) => {
  const totalPreguntas = quizData.question.length;

  // Estado de respuestas del usuario
  const [answers, setAnswers] = React.useState<UserAnswer[]>(() =>
    quizData.question.map((q) => {
      const t = q.type as QuestionType;
      if (t === "true_false") return { type: "true_false", selected: null };
      if (t === "multiple_choice") return { type: "multiple_choice", selected: new Set() };
      return { type: "fill_in_the_blank", text: "" };
    })
  );

  const [attempt, setAttempt] = React.useState(1);
  const [showResults, setShowResults] = React.useState(false);
  const [score, setScore] = React.useState<number | null>(null);

  // Handlers controlados
  const onSelectTrueFalse = (qi: number, ai: number) => {
    if (showResults) return;
    setAnswers((prev) =>
      prev.map((a, i) => (i === qi ? { type: "true_false", selected: ai } : a))
    );
  };

  const onToggleMultiple = (qi: number, ai: number) => {
    if (showResults) return;
    setAnswers((prev) =>
      prev.map((a, i) => {
        if (i !== qi) return a;
        const sel = new Set((a as any).selected as Set<number>);
        sel.has(ai) ? sel.delete(ai) : sel.add(ai);
        return { type: "multiple_choice", selected: sel } as UserAnswer;
      })
    );
  };

  const onFillText = (qi: number, text: string) => {
    if (showResults) return;
    setAnswers((prev) => prev.map((a, i) => (i === qi ? { type: "fill_in_the_blank", text } : a)));
  };

  // Validación por pregunta → boolean[]
  const validateAll = (): boolean[] => {
    return quizData.question.map((q, qi) => {
      const t = q.type as QuestionType;
      const correctIdxs = q.answers
        .map((a, i) => (a.correct ? i : -1))
        .filter((i) => i >= 0);

      if (t === "true_false") {
        const ua = answers[qi] as Extract<UserAnswer, { type: "true_false" }>;
        if (ua.selected == null) return false;
        return correctIdxs.includes(ua.selected);
      }

      if (t === "multiple_choice") {
        const ua = answers[qi] as Extract<UserAnswer, { type: "multiple_choice" }>;
        const selArr = Array.from(ua.selected);
        if (selArr.length === 0) return false;
        // igualdad estricta de conjuntos
        if (selArr.length !== correctIdxs.length) return false;
        return selArr.every((i) => correctIdxs.includes(i));
      }

      // fill_in_the_blank
      const ua = answers[qi] as Extract<UserAnswer, { type: "fill_in_the_blank" }>;
      const expected = q.answers.find((a) => a.correct)?.text ?? "";
      return normalise(ua.text) === normalise(expected);
    });
  };

  const computeScore = (valids: boolean[]) => {
    const correct = valids.filter(Boolean).length;
    return Math.round((100 * correct) / totalPreguntas * 100) / 100; // dos decimales
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valids = validateAll();

    if (valids.every(Boolean)) {
      const sc = computeScore(valids);
      setScore(sc);
      setShowResults(true);
      toast.success("¡Todas correctas! 🎉");
      return;
    }

    if (attempt >= 3) {
      const sc = computeScore(valids);
      setScore(sc);
      setShowResults(true);
      toast.error("Límite de 3 intentos alcanzado. Mostrando resultados.");
    } else {
      setAttempt((x) => x + 1);
      toast.error("Hay respuestas incorrectas. Intenta de nuevo.");
    }
  };

  // Estilos de resaltado al mostrar resultados
  const answerClass = (qi: number, ai: number) => {
    if (!showResults) return "text-slate-800";
    const q = quizData.question[qi];
    const isCorrect = q.answers[ai].correct;
    const t = q.type as QuestionType;

    if (t === "true_false") {
      const sel = (answers[qi] as any).selected as number | null;
      if (isCorrect) return "text-emerald-700 font-semibold";
      if (sel === ai) return "text-rose-600";
      return "text-slate-800";
    }

    if (t === "multiple_choice") {
      const sel = (answers[qi] as any).selected as Set<number>;
      if (isCorrect) return "text-emerald-700 font-semibold";
      if (sel.has(ai)) return "text-rose-600";
      return "text-slate-800";
    }

    return "text-slate-800";
  };

  return (
    <form onSubmit={onSubmit}>
      <section className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <header className="mb-4">
          <h1 className="text-xl font-bold text-indigo-900">{quizData.title}</h1>
          {!showResults && (
            <p className="mt-1 text-sm text-slate-600">Intento {attempt} de 3</p>
          )}
        </header>

        <ol className="space-y-6">
          {quizData.question.map((q, qi) => {
            const t = q.type as QuestionType;
            return (
              <li key={`${q.text}-${qi}`} className="rounded-xl border border-slate-200 p-4">
                <h2 className="mb-3 text-base font-semibold text-slate-800">
                  {qi + 1}. {q.text}
                </h2>

                {t === "true_false" && (
                  <div className="flex gap-6">
                    {q.answers.map((a, ai) => (
                      <label key={ai} className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name={`q${qi}`}
                          disabled={showResults}
                          checked={(answers[qi] as any).selected === ai}
                          onChange={() => onSelectTrueFalse(qi, ai)}
                          className="size-4"
                        />
                        <span className={answerClass(qi, ai)}>{a.text}</span>
                        {showResults && a.correct && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            Correcta
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}

                {t === "multiple_choice" && (
                  <ul className="space-y-2">
                    {q.answers.map((a, ai) => {
                      const selected = (answers[qi] as any).selected as Set<number>;
                      return (
                        <li key={ai} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            disabled={showResults}
                            checked={selected.has(ai)}
                            onChange={() => onToggleMultiple(qi, ai)}
                            className="size-4"
                          />
                          <span className={answerClass(qi, ai)}>{a.text}</span>
                          {showResults && a.correct && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              Correcta
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}

                {t === "fill_in_the_blank" && (
                  <div>
                    <textarea
                      rows={3}
                      disabled={showResults}
                      value={(answers[qi] as any).text}
                      onChange={(e) => onFillText(qi, e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-indigo-100 focus:ring-2 disabled:bg-slate-50"
                      placeholder="Escribe tu respuesta…"
                    />
                    {showResults && (
                      <p className="mt-2 text-sm">
                        Respuesta correcta:{" "}
                        <span className="font-medium text-emerald-700">
                          {q.answers.find((a) => a.correct)?.text ?? "—"}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {!showResults && attempt <= 3 && (
        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow hover:bg-indigo-700"
          >
            Validar respuestas
          </button>
        </div>
      )}

      {showResults && (
        <p className="mt-4 text-center text-lg font-bold text-slate-800">
          Tu puntuación: <span className="text-indigo-700">{score}%</span>
        </p>
      )}
    </form>
  );
};

export default QuizResult;
