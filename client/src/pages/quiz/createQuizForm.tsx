import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux'
import { reset, createQuiz } from '../../features/quiz/quizSlice'
 import { RootState } from '../../app/store'; 
import Spinner from "../../components/Spinner";

export function CreateQuizPage() {
  const [values, setValues] = React.useState({
      title: "",
      video: Number,
      status: "",
      number_of_question: Number,
      attempts: Number,
  });

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location;
  const videoId = state?.videoId || null;
  const { quizIsError, quizIsSuccess, quizIsLoading, quizMessage, quiz } = useSelector((state: RootState) => state.quiz);


  function handleSubmit(evt) {
    evt.preventDefault();
    const quizData = {
        title: values.title,
        video: videoId,
        status:"pendiente",
        number_of_question: 1,
        attempts: 0,
    }
    dispatch(createQuiz(quizData))
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
    if (quizIsError) {
      toast.error("Ha ocurrido un error");
    }

    if (quizIsSuccess && !quizIsLoading) {
        navigate("/addQuestions");
        console.log("Success")
    }

    dispatch(reset());
  }, [quizIsError, quizIsSuccess, quizIsLoading, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
          CryptoTradeExpress
        </h1>
        {quizIsLoading && <Spinner />}
        {/* @ts-ignore */}
        <input
          id="title"
          name="title"
          type="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Titulo del cuestionario"
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
          <Link to="/uploadVideo">Regresar</Link>
        </button>
      </form>
    </div>
  );
}