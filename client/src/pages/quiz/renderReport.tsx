import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import type { RootState, AppDispatch } from "../../app/store";
import {
  getUserReports,
  getQuizById,
  deleteReport,
  reset,
} from "../../features/quiz/quizSlice";
import type { IReport, IQuiz } from "../../features/quiz/types";

const ReportThumbnails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { reports, isLoading, isError, message } = useSelector(
    (s: RootState) => s.quiz
  );
  const { userInfo } = useSelector((s: RootState) => s.auth);

  // cache local de quizzes por id (solo para título/metadata)
  const [quizMap, setQuizMap] = React.useState<Map<number, IQuiz>>(new Map());

  // Cargar reportes del usuario
  React.useEffect(() => {
    if (!userInfo?.username) return;
    void dispatch(getUserReports(userInfo.username));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, userInfo?.username]);

  // Feedback de error global
  React.useEffect(() => {
    if (isError && message) toast.error(message);
  }, [isError, message]);

  // Traer títulos de quizzes asociados a los reportes (únicos)
  React.useEffect(() => {
    const fetchQuizzes = async () => {
      const ids = Array.from(new Set(reports.map((r) => r.quiz))).filter(Boolean) as number[];
      if (!ids.length) {
        setQuizMap(new Map());
        return;
      }
      try {
        const results = await Promise.all(ids.map((id) => dispatch(getQuizById(id)).unwrap()));
        const m = new Map<number, IQuiz>();
        results.forEach((q) => m.set(q.id, q));
        setQuizMap(m);
      } catch (err) {
        // No bloquea la UI si alguno falla
        console.error("No se pudieron cargar datos de algunos quizzes:", err);
      }
    };
    void fetchQuizzes();
  }, [dispatch, reports]);

  const handleDelete = async (reportId: number) => {
    try {
      await dispatch(deleteReport(reportId)).unwrap();
      toast.success("Reporte eliminado");
    } catch (err) {
      toast.error("No se pudo eliminar el reporte");
      console.error(err);
    }
  };

  const handleModify = (quizId: number) => {
    navigate("/updateQuestions", { state: { id: quizId } });
  };

  // UI
  if (isLoading && reports.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
    );
  }

  if (!reports.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
        No tienes reportes por ahora.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {reports.map((report: IReport) => {
        const quiz = quizMap.get(report.quiz);
        return (
          <ReportCard
            key={report.id}
            report={report}
            quizTitle={quiz?.title}
            onDelete={() => handleDelete(report.id)}
            onModify={() => handleModify(report.quiz)}
          />
        );
      })}
    </div>
  );
};

type CardProps = {
  report: IReport;
  quizTitle?: string;
  onDelete: () => void;
  onModify: () => void;
};

const ReportCard: React.FC<CardProps> = ({ report, quizTitle, onDelete, onModify }) => {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200">
      <div className="mb-2">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
          {quizTitle ?? "Quiz"}
        </h3>
        <p className="mt-1 text-xs font-medium text-slate-700">{report.title}</p>
        <p className="mt-1 line-clamp-3 text-xs text-slate-600">{report.description}</p>
      </div>
      <div className="mt-auto flex gap-2 pt-2">
        <button
          onClick={onDelete}
          className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Eliminar
        </button>
        <button
          onClick={onModify}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Modificar quiz
        </button>
      </div>
    </div>
  );
};

export default ReportThumbnails;
