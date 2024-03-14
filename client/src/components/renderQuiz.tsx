import React from "react";

const QuizForm: React.FC<{ quizData: any }> = ({ quizData }) => {
  return (
    <div className="border border-gray-200 rounded p-4 mb-4 w-full">
      <h1 className="text-2xl font-bold mb-4">{quizData.title}</h1>
      {quizData.question.map((question: any, index: number) => (
        <div key={index}>
          <h2 className="text-xl mb-4 mt-4">{question.text}</h2>
          {question.answers.map((answer: any, answerIndex: number) => (
            <div key={answerIndex}>
              {question.type === "true_false" ? (
                <>
                  <input
                    type="radio"
                    id={`true_${index}_${answerIndex}`}
                    name={`question_${index}`}
                    value={answer.text}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-1"
                    readOnly
                    checked={answer.correct}
                  />
                  <label
                    className={`ms-2 text-lg font-medium text-gray-900 dark:text-gray-300 ${
                      answer.correct ? "text-green-500" : ""
                    }`}
                    htmlFor={`true_${index}_${answerIndex}`}
                  >
                    {answer.text}
                  </label>
                </>
              ) : question.type === "multiple_choice" ? (
                <>
                  <input
                    type="checkbox"
                    id={`option_${index}_${answerIndex}`}
                    name={`question_${index}`}
                    value={answer.text}
                    className="ml-2"
                    readOnly
                    checked={answer.correct}
                  />
                  <label
                    className={`ms-2 text-lg font-medium text-gray-900 dark:text-gray-300 ${
                      answer.correct ? "text-green-500" : ""
                    }`}
                    htmlFor={`option_${index}_${answerIndex}`}
                  >
                    {answer.text}
                  </label>
                </>
              ) : question.type === "fill_in_the_blank" ? (
                <textarea
                  id={`answer_${index}`}
                  name={`question_${index}`}
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  readOnly
                >
                  {answer.text}
                </textarea>
              ) : (
                <input
                  type="text"
                  id={`answer_${index}`}
                  name={`question_${index}`}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default QuizForm;
