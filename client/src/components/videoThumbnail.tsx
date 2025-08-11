import React from "react";
import ReactPlayer from "react-player";
import { useDispatch } from "react-redux";
import { updateViews, updateStars, removeVideo } from "../features/videos/videosSlice";
import type { AppDispatch } from "../app/store";
import type { IVideo } from "../features/videos/types";
import RatingStars from "./ratingStars";

type Props = {
  video: IVideo;
  onViewed?: (video: IVideo) => void;
  onRated?: (rating: number, video: IVideo) => void;
};

const VideoThumbnail: React.FC<Props> = ({ video, onViewed, onRated }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [viewsUpdated, setViewsUpdated] = React.useState(false);
  const [showRating, setShowRating] = React.useState(false);

  // Sube la vista al primer play (no en click del contenedor)
  const handleFirstPlay = async () => {
    if (viewsUpdated) return;
    try {
      await dispatch(updateViews({ id: video.id, views: (video.views ?? 0) + 1 })).unwrap();
      setViewsUpdated(true);
      onViewed?.(video);
    } catch (err) {
      // no bloquea UX
      console.error("No se pudo actualizar vistas:", err);
    }
  };

  const handleEnded = () => setShowRating(true);

  const handleRateVideo = async (rating: number) => {
    try {
      await dispatch(updateStars({ id: video.id, stars: rating })).unwrap();
      setShowRating(false);
      onRated?.(rating, video);
      // Si este flujo corresponde a “revisión del usuario” y luego se oculta:
      await dispatch(removeVideo({ id: video.id })).unwrap();
    } catch (err) {
      console.error("No se pudo actualizar estrellas:", err);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="overflow-hidden rounded-xl shadow ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerDownCapture={(e) => e.stopPropagation()}
      >
        <ReactPlayer
          url={video.url}
          width="100%"
          height="auto"
          controls
          light
          onPlay={handleFirstPlay}
          onEnded={handleEnded}
        />
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-slate-800">{video.title}</h3>

      {
        showRating && (
          <div className="mt-2">
            <RatingStars onRate={handleRateVideo} onClose={() => setShowRating(false)} />
          </div>
        )
      }
    </div >
  );
};

export default VideoThumbnail;
