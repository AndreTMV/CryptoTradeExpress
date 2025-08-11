import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { getNoAcceptedVideos, reset } from "../../features/videos/videosSlice";
import NotAcceptedVideos from "../../components/videoThumbnailsAccept";

const NotAcceptedVideosPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { videos, isLoading, isError, message } = useSelector(
    (s: RootState) => s.videos
  );

  // Carga inicial
  React.useEffect(() => {
    void dispatch(getNoAcceptedVideos());
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const refresh = () => void dispatch(getNoAcceptedVideos());

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-indigo-900">
            Videos pendientes por aceptar
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {videos.length} video{videos.length === 1 ? "" : "s"} encontrados
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            className="rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-200"
          >
            Actualizar
          </button>
          <Link
            to="/sectionsPage"
            className="rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-200"
          >
            Volver a secciones
          </Link>
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          {message || "Ocurrió un error al cargar los videos."}
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          No hay videos pendientes por aceptar.
        </div>
      ) : (
        <NotAcceptedVideos videos={videos} />
      )}
    </div>
  );
};

export default NotAcceptedVideosPage;
