import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { acceptVideo, deleteVideo } from "../features/videos/videosSlice";
import type { AppDispatch } from "../app/store";
import type { IVideo } from "../features/videos/types";
import VideoThumbnail from "./videoThumbnail";
import quizService from "../features/quiz/quizService";
import { toast } from "react-hot-toast";

type Props = {
  videos: IVideo[];
};

const NotAcceptedVideos: React.FC<Props> = ({ videos }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleAccept = async (videoId: number) => {
    try {
      await dispatch(acceptVideo({ id: videoId, accepted: true })).unwrap();
      toast.success("Video aceptado");
    } catch (err) {
      toast.error("No se pudo aceptar el video");
      console.error(err);
    }
  };

  const handleDelete = async (videoId: number) => {
    try {
      await dispatch(deleteVideo(videoId)).unwrap();
      toast.success("Video eliminado");
    } catch (err) {
      toast.error("No se pudo eliminar el video");
      console.error(err);
    }
  };

  const fetchQuizIdByVideo = async (videoId: number) => {
    const { id } = await quizService.getQuizByVideo(videoId);
    return id;
  };

  const handleNavigation = async (videoId: number) => {
    try {
      const quizId = await fetchQuizIdByVideo(videoId);
      navigate("/renderQuiz", { state: { id: quizId } });
    } catch (err) {
      toast.error("No se pudo abrir el quiz");
      console.error("Error al obtener el quiz del video:", err);
    }
  };

  if (!videos.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        No hay videos pendientes por aceptar.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {videos.map((video) => (
        <div key={video.id} className="rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200">
          <VideoThumbnail video={video} />
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => handleAccept(video.id)}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Aceptar
            </button>
            <button
              onClick={() => handleDelete(video.id)}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Eliminar
            </button>
            <button
              onClick={() => handleNavigation(video.id)}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Ver quiz
            </button>
            <Link
              to="/sectionsPage"
              className="ml-auto rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Volver
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotAcceptedVideos;
