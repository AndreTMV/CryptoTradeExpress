import React from "react";
import { FaStar } from "react-icons/fa";

type RatingStarsProps = {
  onRate: (value: number) => void;
  onClose: () => void;
  /** Valor inicial seleccionado (opcional) */
  initial?: number;
  /** Número de estrellas totales (default: 10) */
  max?: number;
  /** Título del modal (opcional) */
  title?: string;
};

const RatingStars: React.FC<RatingStarsProps> = ({
  onRate,
  onClose,
  initial = 0,
  max = 10,
  title = "¿Qué te ha parecido el video?",
}) => {
  const [rating, setRating] = React.useState<number>(initial);
  const [hover, setHover] = React.useState<number | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  // Cerrar con ESC
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Navegación con flechas
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        setRating((r) => Math.min(max, (r || 0) + 1));
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        setRating((r) => Math.max(0, (r || 0) - 1));
      }
      if (e.key === "Enter" && rating > 0) {
        e.preventDefault();
        onRate(rating);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onRate, rating, max]);

  // Cerrar al clickear fuera
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Click en estrella = commit inmediato
  const commit = (value: number) => {
    setRating(value);
    onRate(value);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-title"
    >
      <div
        ref={contentRef}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-start justify-between">
          <h1 id="rating-title" className="text-lg font-bold text-slate-900">
            {title}
          </h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <p className="mb-4 text-sm text-slate-600">
          Usa clic o flechas del teclado. Presiona Enter para confirmar.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: max }).map((_, i) => {
            const value = i + 1;
            const active = (hover ?? rating) >= value;
            return (
              <button
                key={value}
                type="button"
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(value)}
                onBlur={() => setHover(null)}
                onClick={() => commit(value)}
                aria-label={`${value} de ${max}`}
                className="transition-transform hover:scale-110 focus:scale-110 focus:outline-none"
              >
                <FaStar
                  size={28}
                  className={active ? "text-amber-400" : "text-slate-300"}
                />
              </button>
            );
          })}
        </div>

        {rating > 0 && (
          <p className="mt-4 text-center text-sm text-slate-700">
            Seleccionado: <span className="font-semibold">{rating}</span> / {max}
          </p>
        )}
      </div>
    </div>
  );
};

export default RatingStars;
