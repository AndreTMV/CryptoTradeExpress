import React from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";
import { createAnswer, createQuestion } from "../features/quiz/quizSlice";
import type { QuestionType } from "../features/quiz/types";

export interface QuestionProps {
  id: number;
  type: QuestionType;
  quizId: number;
  onDelete: () => void;
  onRegister: (id: number, saveFn: () => Promise<void>) => void;
  onUnregister: (id: number) => void;
}

const Question: React.FC<QuestionProps> = ({
  id,
  type,
  quizId,
  onDelete,
  onRegister,
  onUnregister,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [questionText, setQuestionText] = React.useState<string>("");
  const [options, setOptions] = React.useState<string[]>(
    type === "true_false" ? ["Verdadero", "Falso"] : [""]
  );
  const [correctAnswers, setCorrectAnswers] = React.useState<boolean[]>(
    type === "true_false" ? [false, false] : [false]
  );
  const [answerText, setAnswerText] = React.useState<string>("");

  // Si el tipo cambia (no suele cambiar), ajusta opciones V/F
  React.useEffect(() => {
    if (type === "true_false") {
      setOptions(["Verdadero", "Falso"]);
      setCorrectAnswers([false, false]);
      setAnswerText("");
    } else if (type === "multiple_choice") {
      setOptions(["", ""]);
      setCorrectAnswers([false, false]);
      setAnswerText("");
    } else {
      // fill_in_the_blank
      setOptions([""]);
      setCorrectAnswers([true]); // irrelevante, pero evita warnings
    }
  }, [type]);

  const addOption = () => {
    setOptions((prev) => [...prev, ""]);
    setCorrectAnswers((prev) => [...prev, false]);
  };

  const handleChangeOption = (index: number, value: string) => {
    setOptions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleRemoveOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
    setCorrectAnswers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectCorrectAnswer = (index: number) => {
    setCorrectAnswers((prev) => {
      const next = [...prev];
      next[index] = !prev[index];
      return next;
    });
  };

  const handleRadioChange = (value: "true" | "false") => {
    setCorrectAnswers([value === "true", value === "false"]);
  };

  /** Validación mínima por tipo */
  const validate = (): string | null => {
    if (questionText.trim().length < 3) return "La pregunta es demasiado corta.";
    if (type === "multiple_choice") {
      if (options.length < 2) return "Agrega al menos 2 opciones.";
      if (options.some((o) => !o.trim())) return "Todas las opciones deben tener texto.";
      if (!correctAnswers.some(Boolean)) return "Debes marcar al menos una opción correcta.";
    }
    if (type === "true_false") {
      if (!correctAnswers.some(Boolean)) return "Selecciona Verdadero o Falso como respuesta.";
    }
    if (type === "fill_in_the_blank") {
      if (!answerText.trim()) return "Ingresa la respuesta esperada.";
    }
    return null;
  };

  /** Save function registrada al padre */
  const saveFn = React.useCallback(async () => {
    const err = validate();
    if (err) throw err;

    // 1) Crea la pregunta
    const created = await dispatch(
      createQuestion({
        quiz: quizId,
        question_type: type,
        text: questionText.trim(),
      })
    ).unwrap();

    // 2) Crea respuestas según tipo
    if (type === "multiple_choice" || type === "true_false") {
      const answers = options.map((text, idx) => ({
        question: created.id,
        text: text.trim(),
        correct: !!correctAnswers[idx],
      }));
      await Promise.all(
        answers.map((a) => dispatch(createAnswer(a)).unwrap())
      );
    } else {
      // fill_in_the_blank
      await dispatch(
        createAnswer({
          question: created.id,
          text: answerText.trim(),
          correct: true,
        })
      ).unwrap();
    }
  }, [dispatch, quizId, type, questionText, options, correctAnswers, answerText]);

  // Registrar / desregistrar con el padre
  React.useEffect(() => {
    onRegister(id, saveFn);
    return () => onUnregister(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, saveFn]); // registrar de nuevo si cambia el contenido

  return (
    <div>
      <input
        type="text"
        placeholder="Escribe tu pregunta…"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        className="mb-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-black shadow-sm outline-none ring-indigo-100 focus:ring-2"
      />

      {type === "true_false" && (
        <div className="flex gap-6 text-black">
          <label className="inline-flex items-center gap-2">
            <input
              checked={correctAnswers[0]}
              type="radio"
              value="true"
              name={`tf-${id}`}
              onChange={() => handleRadioChange("true")}
            />
            Verdadero
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              checked={correctAnswers[1]}
              type="radio"
              value="false"
              name={`tf-${id}`}
              onChange={() => handleRadioChange("false")}
            />
            Falso
          </label>
        </div>
      )}

      {type === "multiple_choice" && (
        <div className="space-y-2 text-black">
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Opción ${idx + 1}`}
                value={opt}
                onChange={(e) => handleChangeOption(idx, e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm outline-none ring-indigo-100 focus:ring-2"
              />
              <input
                type="checkbox"
                checked={!!correctAnswers[idx]}
                onChange={() => handleSelectCorrectAnswer(idx)}
                title="Correcta"
              />
              {idx > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  className="rounded bg-rose-50 px-2 py-1 text-sm text-rose-700 hover:bg-rose-100"
                >
                  Quitar
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="rounded bg-indigo-600 px-3 py-1 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Agregar opción
          </button>
        </div>
      )}

      {type === "fill_in_the_blank" && (
        <textarea
          rows={3}
          placeholder="Escribe la respuesta esperada…"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-black shadow-sm outline-none ring-indigo-100 focus:ring-2"
        />
      )}

      <div className="mt-4">
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg bg-rose-50 px-3 py-1.5 text-rose-700 hover:bg-rose-100"
        >
          Eliminar pregunta
        </button>
      </div>
    </div>
  );
};

export default Question;
