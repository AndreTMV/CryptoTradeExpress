import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { HiPlus, HiArrowLeft, HiExclamationTriangle } from "react-icons/hi2";
import Spinner from "../../components/Spinner";
import { createQuiz, reset } from "../../features/quiz/quizSlice";
import type { RootState, AppDispatch } from "../../app/store";

type LocationState = { videoId?: number };

const CreateQuizPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { videoId } = (location.state || {}) as LocationState;

  const { isLoading, isError, message } = useSelector((s: RootState) => s.quiz);

  const [title, setTitle] = React.useState<string>("");

  // feedback de errores globales
  React.useEffect(() => {
    if (isError && message) toast.error(message);
  }, [isError, message]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = title.trim();
    if (!videoId) {
      toast.error("No se encontró el video. Vuelve a subir o selecciona un video.");
      navigate("/uploadVideo");
      return;
    }
    if (trimmed.length < 3) {
      toast.error("El título debe tener al menos 3 caracteres.");
      return;
    }

    try {
      const created = await dispatch(
        createQuiz({
          title: trimmed,
          video: videoId,
          status: "pendiente",
          number_of_question: 0,
        })
      ).unwrap();

      toast.success("Quiz creado correctamente.");
      navigate("/addQuestions", { state: { quizId: created.id } });
    } catch (err) {
      const msg = typeof err === "string" ? err : "No se pudo crear el quiz.";
      toast.error(msg);
    } finally {
      dispatch(reset());
    }
  };

  const disabled = title.trim().length < 3 || !videoId;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-xl items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full rounded-2xl bg-white/80 p-6 shadow-xl ring-1 ring-slate-200 backdrop-blur"
        aria-labelledby="create-quiz-title"
      >
        <div className="mb-4 flex items-center justify-between">
          <h1 id="create-quiz-title" className="text-xl font-bold text-indigo-900">
            Nuevo quiz
          </h1>
          <Link
            to="/uploadVideo"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-200"
          >
            <HiArrowLeft className="shrink-0" /> Regresar
          </Link>
        </div>

        {!videoId && (
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
            <HiExclamationTriangle className="shrink-0" />
            <span>No se recibió el ID del video. Debes crear el quiz desde “Subir video”.</span>
          </div>
        )}

        <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
          Título del quiz
        </label>
        <input
          id="title"
          name="title"
          type="text"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Cuestionario de indicadores básicos"
          className="mb-6 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none ring-indigo-100 focus:ring-2"
        />

        <div className="mt-2 flex justify-center">
          <button
            type="submit"
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <HiPlus className="shrink-0" /> Crear quiz
          </button>
        </div>

        {//isLoading && (
          //<div className="mt-4 flex items-center justify-center gap-3">
          //<Spinner />
          //<span className="text-sm text-slate-600">Creando…</span>
          //</div>
          //)
        }
      </form>
    </div>
  );
};

export default CreateQuizPage;
