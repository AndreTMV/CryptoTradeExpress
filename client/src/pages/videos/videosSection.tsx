import { useState, useEffect } from "react";
import {Link, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { reset,getAllSections } from "../../features/videos/videosSlice"


function SectionButton({ section }) {

  const navigate = useNavigate();
  function handleSubmit(evt: { preventDefault: () => void; }) {
    evt.preventDefault();
    navigate('/videosMain', {
      state: { sectionId:section.id }
    }); 
  }
  return (
    <div className="section-button" style={{ width: '300px', marginBottom: '20px' }}>
      <button className="btn text-white bg-indigo-300 rounded-md"
        onClick={handleSubmit}>
        {section.name}
      </button>
    </div>
  );
}

function SectionButtons({ sections }) {
  return (
    <div className="video-thumbnails grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {sections
        .map((section) => (
          <SectionButton key={section.id} section={section} />
        ))}
    </div>
  );
}

function VideosSectionPage()
{
    const { isStaff } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const { videoIsError, videoIsSuccess, videoIsLoading, videoMessage, allLoaded } = useSelector((state) => state.videos);
    const [sections, setSections] = useState([]);
    async function fetchSections() {
      try {
        const sectionsData = await dispatch(getAllSections());
        setSections(sectionsData.payload); 
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    }

    useEffect(() => {
        fetchSections();

        dispatch(reset());
      }, [videoIsError, allLoaded, videoIsLoading, videoMessage, dispatch]);

  return (
    <div className="sections-page">
      <SectionButtons sections={sections} />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
        <Link to="/dashboard">Regresar</Link>
      </button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
        <Link to="/uploadVideo">Subir video</Link>
      </button>
      {(isStaff) ? 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
          <Link to="/uploadSection">Agregar seccion</Link>
        </button>
          :
          null 
      }
      {(isStaff) ? 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
          <Link to="/deleteSection">Eliminar seccion</Link>
        </button>
          :
          null 
      }
      {(isStaff) ? 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
          <Link to="/notAcceptedVideos">Aceptar videos</Link>
        </button>
          :
          null 
      }
    </div>
  );
}

export default VideosSectionPage;