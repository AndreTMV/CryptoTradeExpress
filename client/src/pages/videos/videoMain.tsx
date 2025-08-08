//import React, { useState, useEffect } from "react";
//import {Link, useLocation} from 'react-router-dom'
//
//import { useDispatch, useSelector } from 'react-redux'
//import { reset, getSectionVideos, updateViews } from "../../features/videos/videosSlice"
//import VideoThumbnails from "../../components/videoThumbnails";
//
//
//
//function UploadedVideosPage()
//{
//    const dispatch = useDispatch()
//    const location = useLocation()
//    const { videoIsError, videoIsSuccess, videoIsLoading, videoMessage, allLoaded } = useSelector((state) => state.videos);
//    const [videos, setVideos] = useState([]);
//    const id = location.state?.sectionId; 
//
//    async function fetchVideos() {
//      try {
//        const videosData = await dispatch(getSectionVideos({id}));
//        setVideos(videosData.payload); 
//      } catch (error) {
//        console.error("Error fetching videos:", error);
//      }
//    }
//
//    useEffect(() => {
//        fetchVideos();
//
//        dispatch(reset());
//      }, [videoIsError, allLoaded, videoIsLoading, videoMessage, dispatch]);
//
//  return (
//    <div className="upload-video-page">
//      <VideoThumbnails videos={videos} />
//      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
//        <Link to="/sectionsPage">Regresar</Link>
//      </button>
//    </div>
//  );
//}
//
//export default UploadedVideosPage;
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  getSectionVideos,
  reset,
  updateViews,
} from "../../features/videos/videosSlice";
import type { RootState, AppDispatch } from "../../app/store";
import { IVideo } from "../../features/videos/types";
import VideoThumbnails from "../../components/videoThumbnails";

type LocationState = { sectionId?: number; sectionName?: string };

const UploadedVideosPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, sectionName } = (location.state || {}) as LocationState;

  const { videos, isLoading, isError, message } = useSelector(
    (s: RootState) => s.videos
  );

  // cargar videos de la sección
  React.useEffect(() => {
    if (!sectionId) {
      toast.error("Sección no especificada.");
      navigate("/sectionsPage");
      return;
    }
    void dispatch(getSectionVideos(sectionId));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, navigate, sectionId]);

  // errores del slice
  React.useEffect(() => {
    if (isError && message) toast.error(message);
  }, [isError, message]);

  // opcional: incrementar vistas cuando el usuario abre un video (lo dispararemos desde la lista)
  const handleOpenVideo = async (video: IVideo) => {
    try {
      await dispatch(
        updateViews({ id: video.id, views: (video.views ?? 0) + 1 })
      );
    } catch {
      /* no estorbar la UX si falla */
    }
  };

  const accepted = React.useMemo(
    () => videos.filter((v) => v.accepted),
    [videos]
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-indigo-900">
            {sectionName ? `Videos: ${sectionName}` : "Videos de la sección"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {accepted.length} video{accepted.length === 1 ? "" : "s"} publicados
          </p>
        </div>
        <Link
          to="/sectionsPage"
          className="rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-200"
        >
          Regresar
        </Link>
      </div>

      {/* loading / empty states */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl bg-slate-200"
            />
          ))}
        </div>
      ) : accepted.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          No hay videos publicados en esta sección todavía.
        </div>
      ) : (
        <VideoThumbnails videos={accepted} onOpen={handleOpenVideo} />
      )}
    </div>
  );
};

export default UploadedVideosPage;
