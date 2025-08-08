import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { HiPlus, HiArrowLeft } from "react-icons/hi2";
import Spinner from "../../components/Spinner";
import { uploadSection, reset } from "../../features/videos/videosSlice";
import type { RootState, AppDispatch } from "../../app/store";

const UploadSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message, sections } = useSelector(
    (s: RootState) => s.videos
  );

  const [name, setName] = React.useState<string>("");

  // Notifica errores del slice
  React.useEffect(() => {
    if (isError && message) toast.error(message);
  }, [isError, message]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (trimmed.length < 3) {
      toast.error("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    // Evita duplicados por nombre (opcional)
    const exists = sections.some(
      (s) => s.name.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      toast.error("Ya existe una sección con ese nombre.");
      return;
    }

    try {
      await dispatch(uploadSection({ name: trimmed })).unwrap();
      toast.success("Se creó la sección.");
      setName("");
      navigate("/sectionsPage");
    } catch (err) {
      const msg = typeof err === "string" ? err : "No se pudo crear la sección.";
      toast.error(msg);
    } finally {
      dispatch(reset());
    }
  };

  const disabled = isLoading || name.trim().length < 3;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-xl items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full rounded-2xl bg-white/80 p-6 shadow-xl ring-1 ring-slate-200 backdrop-blur"
        aria-labelledby="upload-section-title"
      >
        <div className="mb-4 flex items-center justify-between">
          <h1 id="upload-section-title" className="text-xl font-bold text-indigo-900">
            Nueva sección
          </h1>
          <Link
            to="/sectionsPage"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-200"
          >
            <HiArrowLeft className="shrink-0" /> Regresar
          </Link>
        </div>

        <p className="mb-5 text-sm text-slate-600">
          Crea una categoría para organizar tus videos.
        </p>

        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
          Nombre de la sección
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="p. ej., Cryptos, Análisis técnico…"
          className="mb-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none ring-indigo-100 focus:ring-2"
          aria-invalid={name.trim().length > 0 && name.trim().length < 3}
        />

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white shadow hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <HiPlus className="shrink-0" /> Agregar sección
          </button>

        </div>

        {isLoading && (
          <div className="mt-4 flex items-center gap-3">
            <Spinner />
            <span className="text-sm text-slate-600">Guardando…</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default UploadSection;
