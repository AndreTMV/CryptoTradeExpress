import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../app/store';
import QuizResult from "../../components/answerQuiz";
import quizService from '../../features/quiz/quizService';
import { reset, deleteReport, getQuizReport, getUserReports} from '../../features/quiz/quizSlice';

function ReportThumbnails() {
  const dispatch = useDispatch();
  const { quizIsError, quizIsSuccess, quizIsLoading, quizMessage, allQuizzesLoaded, report } = useSelector((state: RootState) => state.quiz);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizReports, setQuizReports] = useState([])

  async function fetchReports() {
    try {
      const userData = {
        username: userInfo.username,
      }
      const reportData = await dispatch(getUserReports(userData));
      setReports(reportData.payload);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }
  async function fetchQuizReports() {
    try {
      console.log(reports)
      const promises = reports.map(async (report) => {
        console.log("Fetching report:", report);
        const reportData = {
          id: report.quiz
        };
        const quizData = await dispatch(getQuizReport(reportData));
        console.log("Received quiz data:", quizData);
        return quizData.payload;
      });
      const resolvedQuizReports = await Promise.all(promises);
      console.log(resolvedQuizReports)
      setQuizReports(resolvedQuizReports);
      console.log(quizReports)
    } catch (error) {
      console.error("Error fetching quiz reports:", error);
      // Manejar el error de manera apropiada
    } finally {
      setLoading(false);
    }
  }
useEffect(() => {
  const fetchData = async () => {
    try {
      const userData = {
        username: userInfo.username,
      }
      const reportData = await dispatch(getUserReports(userData));
      setReports(reportData.payload);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [allQuizzesLoaded, dispatch]);

  useEffect(() => {
    if (reports.length > 0) {
      fetchQuizReports();
    }
  }, [reports]);

  return (
    <div className="video-thumbnails grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {reports.map((report, index) => (
          <ReportButton key={report.id} reportData={report} quiz={quizReports[index]} />
        ))}
    </div>
  );
}
function ReportButton({ reportData, quiz }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handleClick() {
    navigate("/updateQuestions", { state: { id: quiz.id } });

  }

return (
    <div className="quiz-button bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="quiz-info">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{quiz?.title}</h3>
        <p className="text-gray-600">{reportData.title}</p>
        <p className="text-gray-600">{reportData.description}</p>
      </div>
    <button className="btn bg-indigo-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-indigo-700"
      onClick={() => dispatch(deleteReport({id:reportData.id})) }>
        Eliminar
      </button>
    <button className="btn bg-indigo-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-indigo-700"
      onClick={handleClick}>
        Modificar Quiz
      </button>
    </div>
     );
}
export default ReportThumbnails;