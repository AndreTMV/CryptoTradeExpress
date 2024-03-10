import React, { useState } from "react";
import ReactPlayer from "react-player";
import { updateViews, updateStars, removeVideo } from "../features/videos/videosSlice";
import { useDispatch } from 'react-redux';
import RatingStars from "./ratingStars";

function VideoThumbnail( { video } )
{
  const dispatch = useDispatch();
  const [viewsUpdated, setViewsUpdated] = useState(false);
  const [videoEnded, setVideoEnded] = useState( false );
  const [showRating, setShowRating] = useState( false ); 

  const handleVideoView = async () => {
    if (!viewsUpdated) {
      try {
        await dispatch(updateViews({ id: video.id }));
        console.log("Vistas del video actualizadas correctamente");
        setViewsUpdated(true);
      } catch (error) {
        console.error("Error actualizando las vistas del video:", error);
      }
    }
  };

  const handleVideoEnded = () => {
    setVideoEnded(true); 
    setShowRating( true );
  };

  const handleRateVideo = async (rating) => {
    try {

      await dispatch(updateStars({ id: video.id, star: rating }));
      console.log("Estrellas del video actualizadas correctamente");
      setShowRating( false );
      await dispatch(removeVideo({id: video.id}));
    } catch ( error )
    {
      console.error("Error actualizando las estrellas del video:", error);
    }
  };

  const handleClose = () => {
    setShowRating(false);
  };

  return (
    <div className="video-thumbnail" style={{ width: '300px', marginBottom: '20px' }}
      onClick={handleVideoView}>
      <ReactPlayer
        url={video.url}
        width="100%" 
        height="auto" 
        light={true} 
        onEnded={handleVideoEnded} 
      />
      <h3>{video.title}</h3>
      {showRating && <RatingStars onRate={handleRateVideo} onClose={handleClose} />}
    </div>
  );
}

export default VideoThumbnail;

