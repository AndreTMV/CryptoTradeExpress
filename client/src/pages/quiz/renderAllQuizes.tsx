import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../app/store";
import { getAllQuizzes, reset } from "../../features/quiz/quizSlice";
import type { IQuiz } from "../../features/quiz/types";

const QuizThumbnails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { quizzes, isLoading, isError, message } = useSelector((s: RootState) => s.quiz);

  React.useEffect(() => {
    if (!quizzes.length) void dispatch(getAllQuizzes());
    return () => {
      dispatch(reset());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const accepted = React.useMemo(
    () => quizzes.filter((q) => q.status === "aceptado"),
    [quizzes]
  );

  const goToPending = () => navigate("/renderReports");

  if (isLoading && !quizzes.length) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        {message || "Ocurrió un error al cargar los quizzes."}
      </div>
    );
  }

  if (!accepted.length) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          No hay quizzes aceptados por ahora.
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={goToPending}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Ver quizzes pendientes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between px-1">
        <h1 className="text-lg font-bold text-indigo-900">
          Quizzes disponibles ({accepted.length})
        </h1>
        <button
          onClick={goToPending}
          className="rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-200"
        >
          Quizzes pendientes
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {accepted.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            onStart={() => navigate("/answerQuiz", { state: { id: quiz.id } })}
          />
        ))}
      </div>
    </div>
  );
};

type CardProps = {
  quiz: IQuiz;
  onStart: () => void;
};

const QuizCard: React.FC<CardProps> = ({ quiz, onStart }) => {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200">
      <div className="mb-2">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
          {quiz.title}
        </h3>
        <p className="mt-1 text-xs text-slate-600">
          Preguntas: <span className="font-medium">{quiz.number_of_question}</span>
        </p>
      </div>
      <div className="mt-auto pt-2">
        <button
          onClick={onStart}
          className="w-full rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Realizar quiz
        </button>
      </div>
    </div>
  );
};

export default QuizThumbnails;
