//import VideoThumbnail from "./videoThumbnail";
//
//function VideoThumbnails({ videos }) {
//  return (
//    <div className="video-thumbnails">
//      {videos
//        .filter((video) => video.accepted) 
//        .map((video) => (
//          <VideoThumbnail key={video.id} video={video} />
//        ))}
//    </div>
//  );
//}
//
//export default VideoThumbnails;
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
        <div
          key={video.id}
          onClick={() => onOpen?.(video)}
          className="group cursor-pointer"
        >
          <VideoThumbnail video={video} />
        </div>
      ))}
    </div>
  );
};

export default VideoThumbnails;
