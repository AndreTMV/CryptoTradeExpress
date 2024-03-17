import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reset ,createReport } from '../features/quiz/quizSlice'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../app/store'; 
import {toast} from 'react-hot-toast'

const RejectionForm:React.FC<{ id:number}> = ({ id }, ) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { quizIsError, quizIsSuccess, quizIsLoading, quizMessage, report } = useSelector((state: RootState) => state.quiz);

  const handleSubmit = (event) => {
    event.preventDefault();
    const reportData = {
      quiz:id,
      title,
      description
    }
    dispatch(createReport(reportData))
  };

  useEffect(() => {
    if ( quizIsError ) { 
      toast.error("Ha ocurrido un error, intentelo de nuevo")
    }
    if ( quizIsSuccess)
    {
      navigate('/notAcceptedVideos')
      toast.success("Se le notificara al usuario");

    }
    return () => dispatch(reset())
  }, [quizIsError, quizIsSuccess ])
  


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Título del Reporte:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
              Razón del Rechazo:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="reason"
              placeholder="Escriba aquí la razón del rechazo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectionForm;
