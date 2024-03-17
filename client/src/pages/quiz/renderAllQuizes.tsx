import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../app/store';
import QuizResult from "../../components/answerQuiz";
import quizService from '../../features/quiz/quizService';
import { reset, getAllQuizzes } from '../../features/quiz/quizSlice';

function QuizThumbnails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quizIsError, quizIsSuccess, quizIsLoading, quizMessage, allQuizzesLoaded, quiz } = useSelector((state: RootState) => state.quiz);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchQuizzes() {
    try {
      const quizData = await dispatch(getAllQuizzes());
      setQuizzes(quizData.payload); 
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  }

  // useEffect(() => {
  //   if ( !allQuizzesLoaded )
  //   {
  //   fetchQuizzes();
  //   }
  //   dispatch(reset());
  // }, [quizIsError, quizIsLoading, quizMessage, allQuizzesLoaded, dispatch]);
useEffect(() => {
    fetchQuizzes();
}, [allQuizzesLoaded, dispatch]);

  return (
    <div className="video-thumbnails grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {quizzes.filter((quiz) => quiz.status === "aceptado").
        map( ( quiz ) => (
        <QuizButton key={quiz.id} quiz={quiz} />
      ))}
      <button className="btn bg-indigo-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-indigo-700" onClick={() => navigate("/renderReports")}>
        Quizzes Pendientes
      </button>
    </div>
  );
}
function QuizButton({ quiz }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate('/answerQuiz', { state: { id: quiz.id } });
  }

return (
    <div className="quiz-button bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="quiz-info">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{quiz.title}</h3>
        <p className="text-gray-600">Número de preguntas: {quiz.number_of_question}</p>
      </div>
      <button className="btn bg-indigo-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-indigo-700" onClick={handleClick}>
        Realizar Quiz
      </button>

    </div>
     );
}
export default QuizThumbnails;
