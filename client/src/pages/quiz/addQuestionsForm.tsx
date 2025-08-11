import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { HiPlus, HiTrash } from "react-icons/hi2";
import type { RootState, AppDispatch } from "../../app/store";
import { updateNumberQuestions, reset } from "../../features/quiz/quizSlice";
import { addNotification } from "../../features/notificationSlice";
import Question from "../../components/question";
import type { QuestionType } from "../../features/quiz/types";

type LocationState = { quizId?: number; title?: string };

type Draft = {
  id: number;
  type: QuestionType;
};

const AddQuestionsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { quizId, title } = (location.state || {}) as LocationState;

  const { isLoading, isError, message } = useSelector((s: RootState) => s.quiz);

  const [drafts, setDrafts] = React.useState<Draft[]>([
    { id: 1, type: "true_false" },
  ]);
  const [selectedType, setSelectedType] = React.useState<QuestionType>("true_false");

  // Cada pregunta se registra aquí para que el padre pueda guardar todo al final
  const saveFnsRef = React.useRef<Map<number, () => Promise<void>>>(new Map());

  const registerSave = React.useCallback((id: number, fn: () => Promise<void>) => {
    saveFnsRef.current.set(id, fn);
  }, []);
  const unregisterSave = React.useCallback((id: number) => {
    saveFnsRef.current.delete(id);
  }, []);

  React.useEffect(() => {
    if (!quizId) {
      toast.error("No se encontró el quiz. Vuelve a crearlo.");
      navigate("/uploadVideo");
    }
  }, [quizId, navigate]);

  React.useEffect(() => {
    if (isError && message) toast.error(message);
  }, [isError, message]);

  const addQuestion = () => {
    const nextId = drafts.length ? Math.max(...drafts.map(d => d.id)) + 1 : 1;
    setDrafts([...drafts, { id: nextId, type: selectedType }]);
  };

  const removeDraft = (id: number) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
    unregisterSave(id);
  };

  const handleFinish = async () => {
    if (!quizId) return;
    if (drafts.length === 0) {
      toast.error("Debes agregar al menos una pregunta.");
      return;
    }

    try {
      // Guardar todas las preguntas (cada child valida y hace sus dispatch)
      const fns = Array.from(saveFnsRef.current.values());
      if (fns.length !== drafts.length) {
        toast.error("Hay preguntas sin completar. Revisa los campos.");
        return;
      }
      await Promise.all(fns.map(fn => fn()));

      // Actualizar número de preguntas del quiz
      await dispatch(
        updateNumberQuestions({ id: quizId, questions: drafts.length })
      ).unwrap();

      dispatch(addNotification("Se ha subido un nuevo cuestionario"));
      toast.success("Cuestionario guardado con éxito. Se notificará al moderador.");
      navigate("/dashboard");
    } catch (err) {
      const msg = typeof err === "string" ? err : "No se pudo guardar el cuestionario.";
      toast.error(msg);
    } finally {
      dispatch(reset());
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-indigo-900">
          {title ? `Quiz: ${title}` : "Agregar Preguntas"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Crea preguntas del tipo que necesites y, al terminar, guarda el cuestionario.
        </p>
      </div>

      {/* Selector de tipo + agregar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as QuestionType)}
          className="w-full max-w-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none ring-indigo-100 focus:ring-2"
        >
          <option value="true_false">Verdadero/Falso</option>
          <option value="multiple_choice">Opción múltiple</option>
          <option value="fill_in_the_blank">Completar</option>
        </select>
        <button
          type="button"
          onClick={addQuestion}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow hover:bg-indigo-700"
        >
          <HiPlus /> Agregar pregunta
        </button>
      </div>

      {/* Lista de preguntas */}
      <div className="grid grid-cols-1 gap-6">
        {drafts.map((d) => (
          <div key={d.id} className="rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                Pregunta #{d.id} — {d.type === "true_false" ? "V/F" : d.type === "multiple_choice" ? "Múltiple" : "Completar"}
              </span>
              <button
                type="button"
                onClick={() => removeDraft(d.id)}
                className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-rose-700 hover:bg-rose-100"
                title="Eliminar"
              >
                <HiTrash /> Quitar
              </button>
            </div>

            {quizId && (
              <Question
                id={d.id}
                type={d.type}
                quizId={quizId}
                onDelete={() => removeDraft(d.id)}
                onRegister={registerSave}
                onUnregister={unregisterSave}
              />
            )}
          </div>
        ))}
      </div>

      {/* Footer acciones */}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={handleFinish}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Guardar cuestionario
        </button>
      </div>
    </div>
  );
};

export default AddQuestionsPage;
