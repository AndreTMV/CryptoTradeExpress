import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";

import QuizForm from "../../components/renderQuiz";
import RejectionForm from "../../components/rejectForm";

import type { RootState, AppDispatch } from "../../app/store";
import { renderQuiz, updateQuizStatus, reset } from "../../features/quiz/quizSlice";

type LocationState = { id?: number };

const RenderQuizPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: quizId } = (location.state || {}) as LocationState;

  const { rendered, isLoading, isError, message } = useSelector((s: RootState) => s.quiz);

  const [showRejectionForm, setShowRejectionForm] = React.useState(false);

  // Cargar el quiz renderizado
  React.useEffect(() => {
    if (!quizId) {
      toast.error("No se encontró el ID del quiz.");
      navigate("/notAcceptedVideos");
      return;
    }
    void dispatch(renderQuiz(quizId));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, navigate, quizId]);

  // Feedback de error global del slice
  React.useEffect(() => {
    if (isError && message) toast.error(message);
  }, [isError, message]);

  const handleAccept = async () => {
    if (!quizId) return;
    try {
      await dispatch(updateQuizStatus({ id: quizId, state: "aceptado" })).unwrap();
      toast.success("Quiz aceptado");
      navigate("/notAcceptedVideos");
    } catch (err) {
      toast.error("No se pudo aceptar el quiz");
      console.error(err);
    } finally {
      dispatch(reset());
    }
  };

  const handleReject = () => setShowRejectionForm(true);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-900">Revisión de quiz</h1>
        <Link
          to="/notAcceptedVideos"
          className="rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-200"
        >
          Volver
        </Link>
      </div>

      {/* Estados de carga / error / contenido */}
      {isLoading ? (
        <div className="h-40 animate-pulse rounded-xl bg-slate-200" />
      ) : isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          {message || "Ocurrió un error al cargar el quiz."}
        </div>
      ) : rendered ? (
        <QuizForm quizData={rendered} />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
          No se encontró información del quiz.
        </div>
      )}

      {/* Acciones */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleAccept}
          disabled={isLoading || !rendered}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white shadow hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <HiCheckCircle /> Aceptar
        </button>

        <button
          onClick={handleReject}
          disabled={isLoading || !rendered}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white shadow hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <HiXCircle /> Rechazar
        </button>
      </div>

      {showRejectionForm && (
        <div className="mt-4">
          <RejectionForm id={quizId!} />
        </div>
      )}
    </div>
  );
};

export default RenderQuizPage;
