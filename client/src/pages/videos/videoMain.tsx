import React, { useState, useEffect } from "react";
import {Link, useLocation} from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { reset, getSectionVideos, updateViews } from "../../features/videos/videosSlice"
import VideoThumbnails from "../../components/videoThumbnails";



function UploadedVideosPage()
{
    const dispatch = useDispatch()
    const location = useLocation()
    const { videoIsError, videoIsSuccess, videoIsLoading, videoMessage, allLoaded } = useSelector((state) => state.videos);
    const [videos, setVideos] = useState([]);
    const id = location.state?.sectionId; 

    async function fetchVideos() {
      try {
        const videosData = await dispatch(getSectionVideos({id}));
        setVideos(videosData.payload); 
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    }

    useEffect(() => {
        fetchVideos();

        dispatch(reset());
      }, [videoIsError, allLoaded, videoIsLoading, videoMessage, dispatch]);

  return (
    <div className="upload-video-page">
      <VideoThumbnails videos={videos} />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
        <Link to="/sectionsPage">Regresar</Link>
      </button>
    </div>
  );
}

export default UploadedVideosPage;