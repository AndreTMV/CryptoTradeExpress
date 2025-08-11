import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import type { RootState, AppDispatch } from "../../app/store";
import {
  deleteQuestions,
  getQuizById,
  updateNumberQuestions,
  reset,
} from "../../features/quiz/quizSlice";
import { addNotification } from "../../features/notificationSlice";
import Question from "../../components/question"; // versión refactor con onRegister/onUnregister
import type { QuestionType } from "../../features/quiz/types";

type LocationState = { id?: number };

type Draft = { id: number; type: QuestionType };

const UpdateQuestionsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: quizId } = (location.state || {}) as LocationState;

  const { quiz, isLoading, isError, message } = useSelector(
    (s: RootState) => s.quiz
  );

  // listado local de “bloques” de preguntas a crear
  const [drafts, setDrafts] = React.useState<Draft[]>([
    { id: 1, type: "true_false" },
  ]);
  const [typeToAdd, setTypeToAdd] = React.useState<QuestionType>("true_false");

  // cada Question registra su “save function”
  const saveFnsRef = React.useRef<Map<number, () => Promise<void>>>(new Map());

  // Carga inicial: si hay id, borra preguntas previas y trae metadata del quiz
  React.useEffect(() => {
    if (!quizId) {
      toast.error("No se encontró el ID del quiz.");
      navigate("/renderReports");
      return;
    }
    (async () => {
      try {
        await dispatch(deleteQuestions(quizId)).unwrap();
        await dispatch(getQuizById(quizId)).unwrap();
      } catch (err) {
        // no bloqueamos la vista; se manejará con flags globales si aplica
        console.error(err);
      }
    })();

    return () => {
      dispatch(reset());
    };
  }, [dispatch, navigate, quizId]);

  // Feedback de error global
  React.useEffect(() => {
    if (isError && message) toast.error(message);
  }, [isError, message]);

  // Helpers para manejar el listado local
  const addQuestion = () => {
    const nextId = drafts.length ? Math.max(...drafts.map((d) => d.id)) + 1 : 1;
    setDrafts([...drafts, { id: nextId, type: typeToAdd }]);
  };

  const removeDraft = (id: number) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    saveFnsRef.current.delete(id);
  };

  const register = (id: number, fn: () => Promise<void>) => {
    saveFnsRef.current.set(id, fn);
  };

  const unregister = (id: number) => {
    saveFnsRef.current.delete(id);
  };

  const finishQuiz = async () => {
    if (!quizId) return;
    if (drafts.length === 0) {
      toast.error("Agrega al menos una pregunta.");
      return;
    }

    try {
      // Ejecutar todas las guardas registradas
      const fns = Array.from(saveFnsRef.current.values());
      await Promise.all(fns.map((fn) => fn()));

      await dispatch(
        updateNumberQuestions({ id: quizId, questions: drafts.length })
      ).unwrap();

      dispatch(addNotification("Se actualizó un cuestionario"));
      toast.success(
        "Cuestionario actualizado correctamente. Se notificará al moderador."
      );
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron guardar las preguntas.");
    } finally {
      dispatch(reset());
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-indigo-900">
            {quiz?.title ?? "Editar cuestionario"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Reconstruye las preguntas del quiz. Total: {drafts.length}
          </p>
        </div>
        <Link
          to="/renderReports"
          className="rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-200"
        >
          Volver
        </Link>
      </div>

      {/* Selector para el tipo de la siguiente pregunta */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={typeToAdd}
          onChange={(e) => setTypeToAdd(e.target.value as QuestionType)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-indigo-100 focus:ring-2"
        >
          <option value="true_false">Verdadero/Falso</option>
          <option value="multiple_choice">Opción múltiple</option>
          <option value="fill_in_the_blank">Completar</option>
        </select>

        <button
          type="button"
          onClick={addQuestion}
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
        >
          Agregar pregunta
        </button>
      </div>

      {/* Editor de preguntas */}
      <div className="grid grid-cols-1 gap-6">
        {drafts.map((d) => (
          <div
            key={d.id}
            className="rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                Pregunta #{d.id} —{" "}
                {d.type === "true_false"
                  ? "V/F"
                  : d.type === "multiple_choice"
                    ? "Múltiple"
                    : "Completar"}
              </span>
              <button
                type="button"
                onClick={() => {
                  removeDraft(d.id);
                  unregister(d.id);
                }}
                className="rounded-lg bg-rose-50 px-2 py-1 text-sm font-medium text-rose-700 hover:bg-rose-100"
              >
                Quitar
              </button>
            </div>

            <Question
              id={d.id}
              type={d.type}
              quizId={quizId!}
              onDelete={() => {
                removeDraft(d.id);
                unregister(d.id);
              }}
              onRegister={register}
              onUnregister={unregister}
            />
          </div>
        ))}
      </div>

      {/* Acciones finales */}
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={finishQuiz}
          disabled={drafts.length === 0}
          className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white shadow hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {"Terminar y guardar"}
        </button>
      </div>
    </div>
  );
};

export default UpdateQuestionsPage;
