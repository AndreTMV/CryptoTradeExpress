//import React, {useState, useEffect} from "react";
//import { Link, useNavigate } from "react-router-dom";
//import { toast } from "react-hot-toast";
//import { useDispatch, useSelector } from "react-redux";
//import { reset,uploadVideo, getAllSections, checkEliminatedVideo, checkVideo } from "../../features/videos/videosSlice"
//import { updateNotificationCount, addNotification } from "../../features/notificationSlice";
//
//export function UploadVideoPage() {
//  const [values, setValues] = React.useState({
//    url: "",
//    title: "",
//    section: "",
//  });
//
//  const { url, title, section } = values;
//  const [sections, setSections] = React.useState([])
//  const dispatch = useDispatch();
//  const navigate = useNavigate();
//  const { videoIsError, videoIsSuccess, videoIsLoading, videoMessage, allLoaded, video } = useSelector((state) => state.videos);
//  const {userInfo} = useSelector((state) => state.auth)
//  const {notificationCount} = useSelector((state) => state.notifications)
//  const username = userInfo.id
//  async function fetchSections() {
//      try {
//        const sectionsData = await dispatch(getAllSections());
//        setSections(sectionsData.payload); 
//      } catch (error) {
//        console.error("Error fetching sections:", error);
//      }
//  }
//
//  useEffect(() => {
//    fetchSections();
//  }, [allLoaded]); 
//
//  function handleSubmit( evt: any )
//  {
//    evt.preventDefault()
//    const videoData = {
//      username,
//      url,
//      title,
//      section,
//    }
//    checkVideoExistence(videoData)
//  }
//
//  function handleChange(evt:any) {
//
//    const { target } = evt;
//    const { name, value } = target;
//    const newValues = {
//      ...values,
//      [name]: value,
//    };
//    setValues(newValues);
//  }
//
//  React.useEffect(() => {
//    if (videoIsError) {
//      toast.error( videoMessage);
//        toast.error('Ha ocurrido un error, intentelo de nuevo.')
//    }
//
//    if (videoIsSuccess) {
//        navigate("/createQuiz", { state: { videoId: video.id } });
//        console.log(video.id)
//    }
//    dispatch(reset())
//  }, [ videoIsError, videoIsSuccess, videoIsLoading, videoMessage, navigate, dispatch])
//
//  async function checkVideoExistence(videoData) {
//      const eliminatedResponse = await dispatch(checkEliminatedVideo({ url }));
//      const videoResponse = await dispatch(checkVideo({ url }));
//
//      if (eliminatedResponse.payload.exists) {
//        toast.error("Este video ya ha sido subido");
//      } else if (videoResponse.payload.exists) {
//        toast.error("Este video ya ha sido subido");
//      } else {
//        dispatch(uploadVideo( videoData))
//        dispatch(addNotification("Se ha subido un nuevo video"));
//      }
//    }
//
//
//  return (
//    <div className="flex items-center justify-center h-screen">
//          <form className="bg-white p-8 rounded shadow-md">
//            <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
//              CryptoTradeExpress
//            </h1>
//            <input
//              id="url"
//              name="url"
//              type="url"
//              value={values.url}
//              onChange={handleChange}
//              placeholder="https://example.com"
//              className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
//            />
//            <input
//              id="title"
//              name="title"
//              type="text"
//              value={values.title}
//              onChange={handleChange}
//              placeholder="Titulo del video"
//              className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
//            />
//          <select
//            id="section"
//            name="section"
//            value={values.section}
//            onChange={handleChange}
//            className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
//          >
//            <option value="">Selecciona una sección</option>
//          {
//            sections.map( ( section ) => (
//              <option key={section.id} value={section.id}>
//                {section.name}
//            </option>
//            ))}
//          </select>
//
//            <button
//              type="button"
//              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//              onClick={handleSubmit}
//            >
//            Subir
//            </button>
//            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
//              <Link to="/dashboard">Regresar</Link>
//            </button>
//          </form>
//        </div>
//  );
//}
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { HiPlus, HiCloudArrowUp, HiArrowLeft } from "react-icons/hi2";
import {
  uploadVideo,
  getAllSections,
  reset,
} from "../../features/videos/videosSlice";
import type { RootState, AppDispatch } from "../../app/store";
import Spinner from "../../components/Spinner";
import { addNotification } from "../../features/notificationSlice";

const UploadVideoPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isLoading, isError, message, sections } = useSelector(
    (s: RootState) => s.videos
  );
  const { userInfo } = useSelector((s: RootState) => s.auth);

  const [url, setUrl] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>("");
  const [sectionId, setSectionId] = React.useState<string>("");

  // Cargar secciones si aún no están
  React.useEffect(() => {
    if (!sections.length) void dispatch(getAllSections());
  }, [dispatch, sections.length]);

  // Notifica errores globales del slice
  React.useEffect(() => {
    if (isError && message) toast.error(message);
  }, [isError, message]);

  const isValidUrl = (u: string) => {
    try {
      const parsed = new URL(u);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();
    const parsedSection = Number(sectionId);

    if (!isValidUrl(trimmedUrl)) return toast.error("URL inválida.");
    if (trimmedTitle.length < 3) return toast.error("Escribe un título válido.");
    if (!parsedSection) return toast.error("Selecciona una sección.");

    try {
      // Si tu API ya valida duplicados, puedes omitir estas verificaciones
      // (dejé solo el alta directa). Si necesitas checks previos, re-incorpóralos.
      const payload = {
        username: userInfo?.id, // si tu backend espera id de usuario
        url: trimmedUrl,
        title: trimmedTitle,
        section: parsedSection,
      };

      const created = await dispatch(uploadVideo(payload)).unwrap();
      toast.success("Video subido correctamente.");
      dispatch(addNotification("Se ha subido un nuevo video"));
      // navega directo con el id retornado
      navigate("/createQuiz", { state: { videoId: created.id } });
    } catch (err) {
      const msg = typeof err === "string" ? err : "No se pudo subir el video.";
      toast.error(msg);
    } finally {
      dispatch(reset());
    }
  };

  const disabled =
    isLoading ||
    !isValidUrl(url) ||
    title.trim().length < 3 ||
    !Number(sectionId);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-2xl items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full rounded-2xl bg-white/80 p-6 shadow-xl ring-1 ring-slate-200 backdrop-blur"
        aria-labelledby="upload-video-title"
      >
        <div className="mb-4 flex items-center justify-between">
          <h1 id="delete-section-title" className="text-xl font-bold text-indigo-900">
            Subir Video
          </h1>
          <Link
            to="/sectionsPage"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-200"
          >
            <HiArrowLeft className="shrink-0" /> Regresar
          </Link>
        </div>
        <div className="mb-6">
          <p className="mt-2 text-sm text-slate-600">
            Ingresa la URL, el título y selecciona la sección.
          </p>
        </div>

        <label htmlFor="url" className="mb-2 block text-sm font-medium text-slate-700">
          URL del video
        </label>
        <input
          id="url"
          name="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          className="mb-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none ring-indigo-100 focus:ring-2"
        />

        <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
          Título
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Introducción a indicadores"
          className="mb-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none ring-indigo-100 focus:ring-2"
        />

        <label htmlFor="section" className="mb-2 block text-sm font-medium text-slate-700">
          Sección
        </label>
        <select
          id="section"
          name="section"
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          className="mb-6 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none ring-indigo-100 focus:ring-2"
        >
          <option value="">Selecciona una sección…</option>
          {sections
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>

        <div className="mt-2 flex justify-center">
          <button
            type="submit"
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <HiCloudArrowUp className="shrink-0" /> Subir video
          </button>
        </div>

        {isLoading && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <Spinner />
            <span className="text-sm text-slate-600">Subiendo…</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default UploadVideoPage;
