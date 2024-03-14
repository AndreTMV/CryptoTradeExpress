import React from 'react';
import {Link, useNavigate} from "react-router-dom"
import { useDispatch } from 'react-redux';
import { acceptVideo, deleteVideo } from '../features/videos/videosSlice';
import VideoThumbnail from "./videoThumbnail";
import quizService from '../features/quiz/quizService'

function NotAcceptedVideos({ videos }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAccept = (videoId:number) => {
    const videoData = {
      id: videoId
    }
    dispatch( acceptVideo(videoData));
  };

  const handleDelete = (videoId:number) => {
    const videoData = {
      id: videoId
    }
    dispatch( deleteVideo(videoData));
  };

  const fetchQuizInfo = async (videoId:number) => {
    try {
      const videoData = {
        id:videoId 
      }
      const data = await quizService.getQuiz(videoData);
      return data.id
    } catch (error) {
      console.error("Error al obtener los datos del quiz:", error);
    }
  };
  // const handleNavigation = (videoId:number) =>
  // {
  //   const quizId = fetchQuizInfo(videoId);
  //   navigate("/renderQuiz", { state: { id: quizId } });

  // }
  const handleNavigation = async (videoId:number) => {
    try {
      const quizId = await fetchQuizInfo(videoId);
      console.log(quizId)
      navigate("/renderQuiz", { state: { id: quizId } });
    } catch (error) {
      console.error("Error navigating to quiz:", error);
    }
  }
  return (
    <div className="video-thumbnails w-full">
      {videos
        .map((video) => (
          <div key={video.id} className="video-thumbnail">
            <VideoThumbnail key={video.id} video={video} />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={() => handleAccept(video.id)}>Aceptar</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={() => handleDelete(video.id)}>Eliminar</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={() => handleNavigation(video.id)}> 
              Ver Quiz
            </button>
          </div>
        ))}
    </div>
  );
}

export default NotAcceptedVideos;
