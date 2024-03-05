import  { useState, useEffect } from "react";
import {Link} from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { reset, getNoAcceptedVideos} from "../../features/videos/videosSlice"
import NotAcceptedVideos from "../../components/videoThumbnailsAccept";



function NotAcceptedVideosPage()
{
    const dispatch = useDispatch()
    const { videoIsError, videoIsSuccess, videoIsLoading, videoMessage, allLoaded } = useSelector((state) => state.videos);
    const [videos, setVideos] = useState([]);

    async function fetchVideos() {
      try {
        const videosData = await dispatch(getNoAcceptedVideos());
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
      <NotAcceptedVideos videos={videos} />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
        <Link to="/sectionsPage">Regresar</Link>
      </button>
    </div>
  );
}

export default NotAcceptedVideosPage;