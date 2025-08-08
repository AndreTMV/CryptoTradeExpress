import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { reset, getAllSections } from "../../features/videos/videosSlice";
import { ISection } from "../../features/videos/types";
import { RootState } from "../../app/store";
import { HiPlus, HiTrash, HiVideoCamera, HiCheckCircle } from 'react-icons/hi2';

function SectionButton({ section }: { section: ISection }) {
  const navigate = useNavigate();
  function handleClick() {
    navigate('/videosMain', { state: { sectionId: section.id } });
  }
  return (
    <button
      className="flex min-h-[100px] w-full min-w-[140px] flex-col items-center justify-center rounded-2xl bg-indigo-500 p-6 font-semibold text-white shadow-lg transition hover:bg-indigo-600"
      onClick={handleClick}
      title={section.name}
    >
      <HiVideoCamera size={32} className="mb-2" />
      <span className="truncate">{section.name}</span>
    </button>
  );
}

function SectionButtons({ sections }: { sections: ISection[] }) {
  if (!sections.length) {
    return <div className="w-full py-12 text-center text-gray-500">No hay secciones disponibles.</div>;
  }
  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 py-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {sections.map((section) => (
        <SectionButton key={section.id} section={section} />
      ))}
    </div>
  );
}

function VideosSectionPage() {
  const { isStaff } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { isError, allLoaded, isLoading, message } = useSelector((state: RootState) => state.videos);
  const [sections, setSections] = useState<ISection[]>([]);

  async function fetchSections() {
    try {
      const sectionsData = await dispatch(getAllSections());
      setSections(sectionsData.payload ?? []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  }

  useEffect(() => {
    fetchSections();
    dispatch(reset());
    // eslint-disable-next-line
  }, [isError, allLoaded, isLoading, message, dispatch]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <h2 className="my-8 text-3xl font-bold text-indigo-900 drop-shadow md:text-4xl">Explora Secciones de Video</h2>
      <SectionButtons sections={sections} />
      <div className="mt-10 flex w-full flex-wrap justify-center gap-4">
        <Link to="/dashboard">
          <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2 font-bold text-white shadow transition hover:bg-blue-700">
            Volver al dashboard
          </button>
        </Link>
        <Link to="/uploadVideo">
          <button className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2 font-bold text-white shadow transition hover:bg-emerald-700">
            <HiVideoCamera size={20} /> Subir video
          </button>
        </Link>
        {isStaff && (
          <>
            <Link to="/uploadSection">
              <button className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2 font-bold text-white shadow transition hover:bg-violet-800">
                <HiPlus size={20} /> Agregar sección
              </button>
            </Link>
            <Link to="/deleteSection">
              <button className="flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2 font-bold text-white shadow transition hover:bg-red-700">
                <HiTrash size={20} /> Eliminar sección
              </button>
            </Link>
            <Link to="/notAcceptedVideos">
              <button className="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-2 font-bold text-white shadow transition hover:bg-yellow-600">
                <HiCheckCircle size={20} /> Aceptar videos
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VideosSectionPage;
