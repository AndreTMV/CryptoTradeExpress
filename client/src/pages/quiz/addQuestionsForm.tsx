import React, { useState, useEffect, useRef } from "react";
import Question from "../../components/question";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux'
 import { RootState } from '../../app/store'; 
import { updateNumberQuestions, reset } from '../../features/quiz/quizSlice'
import { updateNotificationCount, addNotification } from "../../features/notificationSlice";

export function AddQuestionsPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { quizIsError, quizIsSuccess, quizIsLoading, quizMessage, quiz } = useSelector((state: RootState) => state.quiz);
  const [questions, setQuestions] = useState([{ id: 1, type: "true_false" }]); 
  const [selectedType, setSelectedType] = useState( "true_false" );
  const [saveQuestion, setSaveQuestion] = useState(false); 
  const {notificationCount} = useSelector((state: RootState) => state.notifications)

  const addQuestion = () => {
  const newQuestionId = questions.length + 1;
    setQuestions([...questions, { id: newQuestionId, type: selectedType }]);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const removeQuestion = (id: number) => {
    const updatedQuestions = questions.filter((question) => question.id !== id);
    setQuestions(updatedQuestions);
  };

  const handleFinishQuiz = () => {
    if (questions.length === 0) {
      toast.error("Debes agregar al menos una pregunta antes de guardar el quiz.");
    } else {
      setSaveQuestion(true);
    }
  };


  useEffect(() => {
    if (quizIsSuccess) {
      const quizData = {
        id: quiz.id,
        questions: questions.length
      }
      dispatch(updateNumberQuestions(quizData));
      dispatch(addNotification("Se ha subido un nuevo cuestionario"));
      toast.success("Se ha subido el video y el cuestionario correctamente, se notificará al moderador")
      navigate("/dashboard");
    }
    dispatch(reset())
  }, [quizIsSuccess]);



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <h2 className="text-2xl font-bold mb-4">Agregar Preguntas</h2>

      {questions.map((question) => (
        <div key={question.id} className="flex items-center mb-4">
          <Question
            key={question.type}
            type={question.type}
            onDelete={() => removeQuestion( question.id )}
            quizId={quiz.id}
            saveQuestion={saveQuestion}
          />
        </div>
      ))}

      <div className="flex flex-col items-center">
        <div className="flex flex-col w-full max-w-md mb-4">
          <select
            id="type"
            value={selectedType}
            onChange={handleTypeChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
         >
            <option value="true_false">Verdadero o Falso</option>
            <option value="multiple_choice">Opción Múltiple</option>
            <option value="fill_in_the_blank">Pregunta Abierta</option>
          </select>
        </div>
        <button
          onClick={addQuestion}
          className="bg-blue-500 text-white px-2 py-1 rounded mb-4"
        >
          Agregar Pregunta
        </button>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={handleFinishQuiz}
        >
         Terminar Quiz 
        </button>
      </div>
    </div>
  );
}