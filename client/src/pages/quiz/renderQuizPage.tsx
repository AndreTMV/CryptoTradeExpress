import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../app/store'; 
import  {useState, useEffect } from "react";
import {  useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import QuizForm from "../../components/renderQuiz";
import RejectionForm from "../../components/rejectForm";
import quizService from '../../features/quiz/quizService'
import {updateQuizStatus, reset} from '../../features/quiz/quizSlice'

function RenderQuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = location.state?.id
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState( "" );
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const { quizIsError, quizIsSuccess, quizIsLoading, quizMessage } = useSelector((state: RootState) => state.quiz);
  const handleRejection = (data) => {
    // Aquí podrías enviar los datos del formulario a tu servidor o manejarlos de alguna otra manera.
    console.log('Datos del reporte rechazado:', data);
    setShowRejectionForm(false); // Ocultar el formulario después de enviarlo
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await quizService.renderQuiz({ id });
        setQuizData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function in case component unmounts before fetch completes
    return () => {
      // Cleanup if necessary
    };
  }, [id]);


  // useEffect(() => {
  //   if (quizIsError) {
  //     toast.error("Ha ocurrido un error");
  //   } else if (quizIsSuccess && !quizIsLoading) {
  //       toast.success("Se ha cambiado el status del quiz");
  //       navigate("/notAcceptedVideos");
  //     dispatch(reset());
  //   }
  // }, [quizIsError, quizIsSuccess, quizIsLoading, quizMessage, navigate, dispatch]);

  return (
    <div className="w-full">
      {quizData ? (
        <QuizForm quizData={quizData} />
      ) : (
        <div>Loading...</div>
      )}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
      onClick={() => dispatch(updateQuizStatus({ state: "aceptado", id: id }))}>
      Aceptar
      </button>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
        onClick={() =>
        {
          setShowRejectionForm(true)
          dispatch( updateQuizStatus( { state: "rechazado", id: id } ) )
        }}>
      Rechazar
      </button>
      {showRejectionForm && <RejectionForm onSubmit={handleRejection} />}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
        <Link to="/notAcceptedVideos">Regresar</Link>
      </button>
    </div>
  );
}

export default RenderQuizPage;
