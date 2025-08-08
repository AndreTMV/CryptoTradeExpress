import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { HiTrash, HiExclamationTriangle, HiArrowLeft } from "react-icons/hi2";
import Spinner from "../../components/Spinner";
import { getAllSections, deleteSection, reset } from "../../features/videos/videosSlice";
import { ISection } from "../../features/videos/types";
import type { RootState, AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";

const DeleteSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { sections, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.videos
  );

  const [selectedId, setSelectedId] = React.useState<number | "">("");

  // Carga inicial de secciones (idempotente)
  React.useEffect(() => {
    if (!sections.length) {
      void dispatch(getAllSections());
    }
  }, [dispatch, sections.length]);

  // Feedback de errores del slice
  React.useEffect(() => {
    if (isError && message) toast.error(message);
  }, [isError, message]);

  // Submit con confirmación
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof selectedId !== "number") {
      toast("Selecciona una sección primero");
      return;
    }

    const name = sections.find((s) => s.id === selectedId)?.name ?? "esta sección";
    const ok = window.confirm(`¿Seguro que deseas eliminar "${name}"? Esta acción no se puede deshacer.`);
    if (!ok) return;

    try {
      await dispatch(deleteSection(selectedId)).unwrap();
      toast.success("Se eliminó la sección.");
      navigate("/sectionsPage");
    } catch (err: unknown) {
      const msg = typeof err === "string" ? err : "No se pudo eliminar la sección";
      toast.error(msg);
    } finally {
      dispatch(reset());
    }
  };

  const empty = !isLoading && sections.length === 0;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-xl items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-2xl bg-white/80 p-6 shadow-xl ring-1 ring-slate-200 backdrop-blur"
        aria-labelledby="delete-section-title"
      >
        <div className="mb-4 flex items-center justify-between">
          <h1 id="delete-section-title" className="text-xl font-bold text-indigo-900">
            Eliminar sección
          </h1>
          <Link
            to="/sectionsPage"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-200"
          >
            <HiArrowLeft className="shrink-0" /> Regresar
          </Link>
        </div>

        <p className="mb-5 text-sm text-slate-600">
          Selecciona la sección que deseas eliminar. Esta acción es permanente.
        </p>

        {isLoading && sections.length === 0 ? (
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-4">
            <Spinner />
            <span className="text-sm text-slate-600">Cargando secciones…</span>
          </div>
        ) : empty ? (
          <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
            <HiExclamationTriangle className="shrink-0" />
            <div>
              <p className="font-medium">Aún no hay secciones.</p>
              <p className="text-sm">Crea una desde “Agregar sección”.</p>
            </div>
          </div>
        ) : (
          <>
            <label htmlFor="sectionId" className="mb-2 block text-sm font-medium text-slate-700">
              Sección
            </label>
            <select
              id="sectionId"
              name="sectionId"
              value={selectedId}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedId(v ? Number(v) : "");
              }}
              className="mb-5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none ring-indigo-100 focus:ring-2"
            >
              <option value="">Selecciona una sección…</option>
              {sections
                .slice()
                .sort((a: ISection, b: ISection) => a.name.localeCompare(b.name))
                .map((s: ISection) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>

            <button
              type="submit"
              disabled={typeof selectedId !== "number" || isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <HiTrash className="shrink-0" /> Eliminar sección
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default DeleteSection;
