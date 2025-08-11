import React from "react";
import { IVideo } from "../features/videos/types";
import VideoThumbnail from "./videoThumbnail";

type Props = {
  videos: IVideo[];
  onOpen?: (video: IVideo) => void;
};

const VideoThumbnails: React.FC<Props> = ({ videos, onOpen }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {videos.map((video) => (
        <div key={video.id} className="group">
          <VideoThumbnail video={video} />
          <button
            className="mt-2 rounded bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
            onClick={() => onOpen?.(video)}
          >
            Abrir
          </button>
        </div>
      ))}
    </div>
  );
};

export default VideoThumbnails;

