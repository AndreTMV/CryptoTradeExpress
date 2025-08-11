import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { AppDispatch, RootState } from "../app/store";
import { createReport, reset } from "../features/quiz/quizSlice";

type Props = {
  id: number;            // quizId
  onClose?: () => void;  // opcional: cerrar modal sin navegar
};

const RejectionForm: React.FC<Props> = ({ id, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isLoading } = useSelector((s: RootState) => s.quiz);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const close = React.useCallback(() => {
    onClose?.();
  }, [onClose]);

  // Cerrar con ESC
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const validTitle = title.trim().length >= 3;
  const validDesc = description.trim().length >= 5;
  const disabled = isLoading || !validTitle || !validDesc;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    try {
      await dispatch(
        createReport({
          quiz: id,
          title: title.trim(),
          description: description.trim(),
        })
      ).unwrap();

      toast.success("Se notificó al usuario.");
      navigate("/notAcceptedVideos");
      close();
    } catch (err) {
      const msg = typeof err === "string" ? err : "No se pudo enviar el reporte.";
      toast.error(msg);
    } finally {
      dispatch(reset());
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rejection-title"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 id="rejection-title" className="text-lg font-bold text-slate-900">
            Rechazar quiz: enviar reporte
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
              Título del reporte
            </label>
            <input
              id="title"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none ring-indigo-100 focus:ring-2"
              placeholder="Ej. Falta contexto en la pregunta 2"
            />
            {!validTitle && title.length > 0 && (
              <p className="mt-1 text-xs text-rose-600">Mínimo 3 caracteres.</p>
            )}
          </div>

          <div>
            <label htmlFor="reason" className="mb-1 block text-sm font-medium text-slate-700">
              Razón del rechazo
            </label>
            <textarea
              id="reason"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-indigo-100 focus:ring-2"
              placeholder="Describe por qué se rechaza el quiz y qué se debe corregir."
            />
            {!validDesc && description.length > 0 && (
              <p className="mt-1 text-xs text-rose-600">Mínimo 5 caracteres.</p>
            )}
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={disabled}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectionForm;
