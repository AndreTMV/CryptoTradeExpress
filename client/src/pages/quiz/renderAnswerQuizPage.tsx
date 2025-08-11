import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import QuizResult from "../../components/answerQuiz";
import type { RootState, AppDispatch } from "../../app/store";
import { renderQuiz, reset } from "../../features/quiz/quizSlice";

type LocationState = { id?: number };

const RenderAnswerQuizPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: quizId } = (location.state || {}) as LocationState;

  const { rendered, isLoading, isError, message } = useSelector(
    (s: RootState) => s.quiz
  );

  // Cargar el quiz renderizado
  React.useEffect(() => {
    if (!quizId) {
      toast.error("No se encontró el ID del quiz.");
      navigate("/allQuizzes");
      return;
    }
    void dispatch(renderQuiz(quizId));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, navigate, quizId]);

  // Feedback de errores globales
  React.useEffect(() => {
    if (isError && message) toast.error(message);
  }, [isError, message]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-900">Resolver quiz</h1>
        <Link
          to="/dashboard"
          className="rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-200"
        >
          Regresar
        </Link>
      </div>

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-xl bg-slate-200" />
      ) : isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          {message || "Ocurrió un error al cargar el quiz."}
        </div>
      ) : rendered ? (
        <QuizResult quizData={rendered} />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
          No se encontró información del quiz.
        </div>
      )}
    </div>
  );
};

export default RenderAnswerQuizPage;
