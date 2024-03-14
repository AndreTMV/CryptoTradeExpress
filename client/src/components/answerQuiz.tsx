import React, { useState } from "react";
import {toast} from 'react-hot-toast'


const QuizResult: React.FC<{ quizData: any }> = ({ quizData }) => {
    const [intentos, setIntentos] = useState(1);
    const [resaltarRespuestas, setResaltarRespuestas] = useState(false); 
    const [puntuacion, setPuntuacion] = useState(0);
    const totalPreguntas = quizData.question.length;

    const validarRespuestas = () => {
        const respuestasCorrectasTemp = quizData.question.map((question: any, index: number) => {
            let respuestasSeleccionadas;
            if (question.type === "fill_in_the_blank") {
                respuestasSeleccionadas = [(document.getElementById(
                    `answer_${index}`
                ) as HTMLTextAreaElement)?.value];
            }
            else if ( question.type === "true_false" )
            {
                respuestasSeleccionadas = [(document.querySelector(
                    `input[name='question_${index}']:checked`
                ) as HTMLInputElement)?.value];
            } else if (question.type === "multiple_choice") {
                respuestasSeleccionadas = Array.from(document.querySelectorAll(
                    `input[name='question_${index}']:checked`
                )).map((input: HTMLInputElement) => input.value);
            }
            const respuestasCorrectasPregunta = question.answers.filter(
                (answer: any) => answer.correct
            ).map((answer: any) => answer.text);
            return (
                respuestasCorrectasPregunta.length === respuestasSeleccionadas.length &&
                respuestasCorrectasPregunta.every((answer: any) =>
                    respuestasSeleccionadas.includes(answer)
                )
            );
        });
        return respuestasCorrectasTemp;
    };
    const calcularPuntuacion = () => {
        const respuestasCorrectasTemp = validarRespuestas();
        const respuestasCorrectas = respuestasCorrectasTemp.filter((respuesta: boolean) => respuesta).length;
        const puntuacionCalculada = (100 * respuestasCorrectas) / totalPreguntas;
        return puntuacionCalculada.toFixed(2); 
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIntentos(prevIntentos => prevIntentos + 1); 
        const respuestasCorrectasTemp = validarRespuestas();
        if ( !respuestasCorrectasTemp.every( ( respuesta: boolean ) => respuesta ) )
        {
          if ( intentos >= 3 )
          {
            toast.error("No has contestado bien en tres intentos, estos son los resultados:")
            setResaltarRespuestas(true)
            setPuntuacion(calcularPuntuacion());
          } else
          {
            toast.error("¡Alguna(s) respuesta(s) es/son incorrecta(s)!")
          }
        } else
        {
            toast.success("Todas las respuestas son correctas")
            setResaltarRespuestas(true)
            setPuntuacion(calcularPuntuacion());

        }
    };
  return (
    <form onSubmit={handleSubmit}>
    <div className="border border-gray-200 rounded p-4 mb-4 w-full">
      <h1 className="text-2xl font-bold mb-4">{quizData.title}</h1>
      {!resaltarRespuestas && <h1 className="text-2xl font-bold mb-4">Intento {intentos}</h1>}      {quizData.question.map((question: any, index: number) => (
        <div key={index}>
          <h2 className="text-xl mb-4 mt-4">{question.text}</h2>
          {question.answers.map((answer: any, answerIndex: number) => (
            <div key={answerIndex}>
              {question.type === "true_false" ? (
                  <>
                      <input
                          type="radio"
                          id={`true_${ index }_${ answerIndex }`}
                          name={`question_${ index }`}
                          value={answer.text}
                          className={`w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-1`}
                      />
                      <label
                          className={`ms-2 text-lg font-medium ${
                                                resaltarRespuestas && !answer.correct ? 'text-red-600' : (resaltarRespuestas && answer.correct ? 'text-green-500' : 'text-slate-50')
                        }`}
                          htmlFor={`true_${ index }_${ answerIndex }`}
                      >
                          {answer.text}
                      </label>
                  </>
              ) : question.type === "multiple_choice" ? (
                  <>
                      <input
                          type="checkbox"
                          id={`option_${ index }_${ answerIndex }`}
                          name={`question_${ index }`}
                          value={answer.text}
                          className="ml-2"
                      />
                      <label
                          className={`ms-2 text-lg font-medium ${
                                                resaltarRespuestas && !answer.correct ? 'text-red-600' : (resaltarRespuestas && answer.correct ? 'text-green-500' : 'text-slate-50')
                        }`}
                      htmlFor={`option_${ index }_${ answerIndex }`}

                      >
                          {answer.text}
                      </label>
                  </>
              ) : question.type === "fill_in_the_blank" ? (
                <div>
                  <textarea
                      id={`answer_${ index }`}
                      name={`question_${ index }`}
                      rows={4}
                      className={`block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                                                resaltarRespuestas && !answer.correct ? 'text-red-600' : (resaltarRespuestas && answer.correct ? 'text-green-500' : 'text-gray-900')
                        }`}
                      placeholder="Escriba su respuesta"
                  ></textarea>
                      {resaltarRespuestas ? 
                     <label
                          className={`ms-2 text-lg font-medium ${
                                                resaltarRespuestas && !answer.correct ? 'text-red-600' : (resaltarRespuestas && answer.correct ? 'text-green-500' : 'text-gray-900')
                        }`}
                      htmlFor={`option_${ index }_${ answerIndex }`}
                      >
                          Respuesta: {answer.text}
                      </label>: null
                      }
                </div>
              ) : (
                  <input
                      type="text"
                      id={`answer_${index}`}
                      name={`question_${index}`}
                      style={{ backgroundColor: resaltarRespuestas && !answer.correct ? 'red' : 'inherit' }}
                  />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
      {intentos <= 3 ? 
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">Validar respuestas</button>
        :null 
    }
    {resaltarRespuestas &&
        <p className="text-2xl font-bold mb-4">Tu puntuación: {puntuacion}%</p>
    }
    </form>

    );
};

export default QuizResult;

