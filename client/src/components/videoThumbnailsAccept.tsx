import React from 'react';
import { useDispatch } from 'react-redux';
import { acceptVideo, deleteVideo } from '../features/videos/videosSlice';
import VideoThumbnail from "./videoThumbnail";

function NotAcceptedVideos({ videos }) {
  const dispatch = useDispatch();

  const handleAccept = (videoId) => {
    const videoData = {
      id: videoId
    }
    dispatch( acceptVideo(videoData));
  };

  const handleDelete = (videoId) => {
    const videoData = {
      id: videoId
    }
    dispatch( deleteVideo(videoData));
  };

  return (
    <div className="video-thumbnails">
      {videos
        .map((video) => (
          <div key={video.id} className="video-thumbnail">
            <VideoThumbnail key={video.id} video={video} />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={() => handleAccept(video.id)}>Aceptar</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={() => handleDelete(video.id)}>Eliminar</button>
          </div>
        ))}
    </div>
  );
}

export default NotAcceptedVideos;
