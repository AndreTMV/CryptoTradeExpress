import React from "react";
import Question from "./question"; 

const QuizUpdate: React.FC<{ quizData: any, onDelete, saveQuestion }> = ({ quizData, onDelete, saveQuestion }) => {
  return (
    <div className="border border-gray-200 rounded p-4 mb-4 w-full">
      <h1 className="text-2xl font-bold mb-4">{quizData.title}</h1>
      {quizData.question.map((question) => (
        <div key={question.id} className="flex items-center mb-4">
          <Question
            key={question.type}
            type={question.type}
            onDelete={onDelete}
            quizId={quizData.id}
            saveQuestion={saveQuestion}
          />
        </div>
      ))}
    </div>
  );
};

export default QuizUpdate;