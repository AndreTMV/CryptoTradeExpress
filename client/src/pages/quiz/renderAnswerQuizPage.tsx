import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../app/store'; 
import  {useState, useEffect } from "react";
import {  useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import QuizResult from "../../components/answerQuiz";
import quizService from '../../features/quiz/quizService'
import {updateQuizStatus, reset} from '../../features/quiz/quizSlice'

function RenderAnswerQuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = location.state?.id
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState( "" );
  const { quizIsError, quizIsSuccess, quizIsLoading, quizMessage } = useSelector((state: RootState) => state.quiz);

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




  return (
    <div className="w-full">
      {quizData ? (
        <QuizResult quizData={quizData} />
      ) : (
        <div>Loading...</div>
      )}
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
        <Link to="/dashboard">Regresar</Link>
      </button>
    </div>
  );
}

export default RenderAnswerQuizPage;

