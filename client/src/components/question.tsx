import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { reset ,createAnswer, createQuestion } from '../features/quiz/quizSlice'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../app/store'; 

interface QuestionProps {
  type: string;
  onDelete: () => void;
  quizId: number;
}


const Question: React.FC<QuestionProps> = ({ type, onDelete, quizId }) => {
  const [questionText, setQuestion] = useState("")
  const [options, setOptions] = useState([""]);
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]);
  const [answerText, setAnswerText] = useState("")
  const dispatch = useDispatch();
  const { quizIsError, quizIsSuccess, quizIsLoading, quizMessage, quiz, question, answer } = useSelector((state: RootState) => state.quiz);

  const addOption = () => {
    setOptions([...options, ""]);
    setCorrectAnswers([...correctAnswers, false]);

  };

  React.useEffect(() => {
    if (type === "true_false") {
      setOptions(["Verdadero", "Falso"]);
      setCorrectAnswers([false, false]);
    }
  }, [type]);

  const handleChangeOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    const newCorrectAnswers = [...correctAnswers];
    newCorrectAnswers.splice(index, 1);
    setCorrectAnswers(newCorrectAnswers);
  };

  const handleSelectCorrectAnswer = (index: number) => {
    const newCorrectAnswers = [...correctAnswers];
    newCorrectAnswers[index] = !correctAnswers[index];
    setCorrectAnswers(newCorrectAnswers);
  };

  const handleRadioChange = (value: string) => {
    const newCorrectAnswers = [value === "true", value === "false"];
    setCorrectAnswers(newCorrectAnswers);
  };


  const handleSaveQuestion = async () => {
    try {
      if (questionText.trim() === "") {
        throw new Error("La pregunta no puede estar en blanco.");
      }
      const questionData = {
        quiz: quizId,
        question_type: type,
        text:questionText
      }
      await dispatch(createQuestion(questionData));
      console.log(question.id)
      if (type === "true_false" || type === "multiple_choice") {
        const answersData = options.map((option, index) => ({
          question: question.id,
          text: option,
          correct: correctAnswers[index]
        }));

        await Promise.all(answersData.map(answer => dispatch(createAnswer(answer))));
      } else if (type === "fill_in_the_blank") {
        if (answerText.trim() === "") {
          throw new Error("La respuesta no puede estar en blanco.");
        }
        const answerData = {
          question: question.id,
          text: answerText,
          correct: true 
        };
        console.log(question.id);
        await dispatch(createAnswer(answerData));
      }
    } catch (error) {
      console.error("Error al guardar la pregunta:", error);
    }
  };

  React.useEffect(() => {
    if ( quizIsError )
    {
      console.log(quizMessage, "Error al guardar la pregunta ")
    }
    else
    {
      console.log(quizMessage)
    }
  

  }, [quizIsError, quizIsLoading, quizIsSuccess, quiz, answer, question, dispatch])
  

  return (
    <div className="border border-gray-200 rounded p-4 mb-4 w-full">
      <input
        type="text"
        placeholder="Escribe tu pregunta aquí"
        value={questionText}
        onChange={(e) => setQuestion(e.target.value)}
        className="block w-full border-b border-gray-300 mb-4 focus:outline-none placeholder-shown:border-gray-500 peer h-full w-full rounded-[7px]  !border  !border-gray-300 border-t-transparent bg-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700  shadow-lg shadow-gray-900/5 outline outline-0 ring-4 ring-transparent transition-all placeholder:text-gray-500 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2  focus:!border-gray-900 focus:border-t-transparent focus:!border-t-gray-900 focus:outline-0 focus:ring-gray-900/10 disabled:border-0 disabled:bg-blue-gray-50 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      {type === "true_false" && (
        <div className="flex flex-wrap">
        <div className="flex items-center me-4">
            <label htmlFor="true" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 mr-3">
                <input checked={correctAnswers[0]} id="true" type="radio" value="true" name="trueFalse" className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-1" onChange={() => handleRadioChange("true")}/>
                True
            </label>
            <label htmlFor="false" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                <input checked={correctAnswers[1]} id="false" type="radio" value="false" name="trueFalse" className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-1" onChange={() => handleRadioChange("false")}
                />
                False
            </label>
        </div>
        </div>
        )}
      {type === "multiple_choice" && (
        <div>
          {options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                placeholder={`Opción ${index + 1}`}
                value={option}
                onChange={(e) => handleChangeOption(index, e.target.value)}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <input
                type="checkbox"
                checked={correctAnswers[index]}
                className="ml-2"
                onChange={() => handleSelectCorrectAnswer(index)}
              />
              {index > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  className="text-red-500 focus:outline-none"
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
          >
            Agregar opción
          </button>
        </div>
      )}

      {type === "fill_in_the_blank" && (
        <textarea id="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Escriba su respuesta aqui" value={answerText} onChange={(e) => setAnswerText(e.target.value)}></textarea>
        )}
        <button onClick={onDelete} className="text-red-500 p-1 rounded-full hover:bg-gray-200 focus:outline-none">
        X
        </button>
        <button
        onClick={handleSaveQuestion}
        className="bg-green-500 text-white px-2 py-1 rounded ml-2 hover:bg-green-600 focus:outline-none"
        >
        Guardar Pregunta
      </button>
    </div>
  );
};

export default Question;