import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux'
import { reset, uploadSection } from '../../features/videos/videosSlice'
import Spinner from "../../components/Spinner";

export function UploadSection() {
  const [values, setValues] = React.useState({
    name:""
  });

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { videoIsError, videoIsSuccess, videoIsLoading, videoMessage } = useSelector((state) => state.videos);

  function handleSubmit(evt) {
    evt.preventDefault();
    const sectionData = {
        name:values.name,
    }
    dispatch(uploadSection(sectionData))
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
        toast.success("Se ha agregado la seccion")
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
        {/* @ts-ignore */}
        <input
          id="name"
          name="name"
          type="name"
          value={values.name}
          onChange={handleChange}
          placeholder="Seccion"
          className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleSubmit}
        >
          Agregar
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
          <Link to="/sectionsPage">Regresar</Link>
        </button>
      </form>
    </div>
  );
}