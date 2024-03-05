import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { reset,uploadVideo, getAllSections, checkEliminatedVideo, checkVideo } from "../../features/videos/videosSlice"
import { updateNotificationCount } from "../../features/notificationSlice";

export function UploadVideoPage() {
  const [values, setValues] = React.useState({
    url: "",
    title: "",
    section: "",
  });

  const { url, title, section } = values;
  const [sections, setSections] = React.useState([])
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { videoIsError, videoIsSuccess, videoIsLoading, videoMessage, allLoaded } = useSelector((state) => state.videos);
  const {userInfo} = useSelector((state) => state.auth)
  const {notificationCount} = useSelector((state) => state.notifications)
  const username = userInfo.id
  async function fetchSections() {
      try {
        const sectionsData = await dispatch(getAllSections());
        setSections(sectionsData.payload); 
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
  }

  useEffect(() => {
    fetchSections();
  }, [allLoaded]); 

  function handleSubmit( evt: any )
  {
    evt.preventDefault()
    const videoData = {
      username,
      url,
      title,
      section,
    }
    checkVideoExistence(videoData)
  }

  function handleChange(evt:any) {
    
    const { target } = evt;
    const { name, value } = target;
    const newValues = {
      ...values,
      [name]: value,
    };
    setValues(newValues);
  }

  React.useEffect(() => {
    if (videoIsError) {
      toast.error( videoMessage);
        toast.error('Ha ocurrido un error, intentelo de nuevo.')
    }

    if (videoIsSuccess) {
        navigate("/dashboard")
        toast.success("Se ha subido el video correctamente, se notificará al moderador")
    }
    dispatch(reset())
  }, [ videoIsError, videoIsSuccess, videoIsLoading, videoMessage, navigate, dispatch])

  async function checkVideoExistence(videoData) {
      const eliminatedResponse = await dispatch(checkEliminatedVideo({ url }));
      const videoResponse = await dispatch(checkVideo({ url }));

      if (eliminatedResponse.payload.exists) {
        toast.error("Este video ya ha sido subido");
      } else if (videoResponse.payload.exists) {
        toast.error("Este video ya ha sido subido");
      } else {
        dispatch(uploadVideo( videoData))
        dispatch(updateNotificationCount(notificationCount + 1));
      }
    }


  return (
    <div className="flex items-center justify-center h-screen">
          <form className="bg-white p-8 rounded shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
              CryptoTradeExpress
            </h1>
            <input
              id="url"
              name="url"
              type="url"
              value={values.url}
              onChange={handleChange}
              placeholder="https://example.com"
              className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              id="title"
              name="title"
              type="text"
              value={values.title}
              onChange={handleChange}
              placeholder="Titulo del video"
              className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
            />
          <select
            id="section"
            name="section"
            value={values.section}
            onChange={handleChange}
            className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">Selecciona una sección</option>
          {
            sections.map( ( section ) => (
              <option key={section.id} value={section.id}>
                {section.name}
            </option>
            ))}
          </select>

            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmit}
            >
            Subir
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
              <Link to="/dashboard">Regresar</Link>
            </button>
          </form>
        </div>
  );
}