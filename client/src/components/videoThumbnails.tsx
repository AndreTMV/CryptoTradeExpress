import VideoThumbnail from "./videoThumbnail";

function VideoThumbnails({ videos }) {
  return (
    <div className="video-thumbnails">
      {videos
        .filter((video) => video.accepted) 
        .map((video) => (
          <VideoThumbnail key={video.id} video={video} />
        ))}
    </div>
  );
}

export default VideoThumbnails;