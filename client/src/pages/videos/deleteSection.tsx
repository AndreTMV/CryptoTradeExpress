import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux'
import { reset,  getAllSections, deleteSection } from '../../features/videos/videosSlice'
import Spinner from "../../components/Spinner";

export function DeleteSection() {
  const [values, setValues] = React.useState({
    id:""
  });

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [sections, setSections] = React.useState([])
  const { videoIsError, videoIsSuccess, videoIsLoading, videoMessage, allLoaded } = useSelector((state) => state.videos);
  async function fetchSections() {
    try {
        const sectionsData = await dispatch(getAllSections());
        setSections(sectionsData.payload); 
    } catch (error) {
        console.error("Error fetching sections:", error);
    }
  }
    
  React.useEffect(() => {
    fetchSections();
  }, [allLoaded]); 

  function handleSubmit(evt) {
    evt.preventDefault();
    const sectionData = {
        id:values.id,
    }
    dispatch(deleteSection(sectionData))
  }

  function handleChange(evt) {
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
      toast.error("Ha ocurrido un error");
    }

    if (videoIsSuccess && !videoIsLoading) {
        navigate("/sectionsPage");
        toast.success("Se ha eliminado la seccion")
    }

    dispatch(reset());
  }, [videoIsError, videoIsSuccess, videoIsLoading, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
          CryptoTradeExpress
        </h1>
        {videoIsLoading && <Spinner />}
        <select
        id="id"
        name="id"
        value={values.id}
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
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleSubmit}
        >
          Eliminar
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
          <Link to="/sectionsPage">Regresar</Link>
        </button>
      </form>
    </div>
  );
}