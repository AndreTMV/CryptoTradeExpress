import api from "../../api/axiosInstance";
import {
  IAnswer,
  IQuestion,
  IQuiz,
  IReport,
  IRenderedQuiz,
  QuizStatus,
} from "./types";

const QUIZ = "quiz/api/v1/quiz/";
const QUESTIONS = "quiz/api/v1/questions/";
const ANSWERS = "quiz/api/v1/answers/";
const INCREASE = "quiz/api/v1/increaseQuestions/";
const RENDER = "quiz/api/v1/renderQuiz/";
const GET_QUIZ = "quiz/api/v1/getQuiz/";
const STATUS = "quiz/api/v1/quizStatus/";
const REPORT = "quiz/api/v1/report/";
const USER_REPORTS = "quiz/api/v1/userReports/";
const DELETE_QS = "quiz/api/v1/deleteQuestions/";

export default {
  // Quiz
  createQuiz: async (quiz: Partial<IQuiz>): Promise<IQuiz> => {
    const { data } = await api.post(QUIZ, quiz);
    return data;
  },
  getAllQuizzes: async (): Promise<IQuiz[]> => {
    const { data } = await api.get(QUIZ);
    return data;
  },
  getQuizById: async (quizId: number): Promise<IQuiz> => {
    const { data } = await api.get(`${QUIZ}${quizId}/`);
    return data;
  },
  getQuizByVideo: async (videoId: number): Promise<{ id: number }> => {
    const { data } = await api.get(GET_QUIZ, { params: { id: videoId } });
    return data;
  },
  updateQuizStatus: async (payload: {
    id: number;
    state: QuizStatus;
  }): Promise<{ status: string; message: string }> => {
    const { data } = await api.put(STATUS, payload);
    return data;
  },
  updateNumberQuestions: async (payload: {
    id: number;
    questions: number;
  }): Promise<{ status: string; message: string }> => {
    const { data } = await api.put(INCREASE, payload);
    return data;
  },
  renderQuiz: async (quizId: number): Promise<IRenderedQuiz> => {
    const { data } = await api.get(`${RENDER}?id=${quizId}`);
    return data;
  },
  deleteQuestions: async (quizId: number): Promise<{ status: string; message: string }> => {
    const { data } = await api.delete(`${DELETE_QS}?id=${quizId}`);
    return data;
  },

  // Q&A
  createQuestion: async (q: Partial<IQuestion>): Promise<IQuestion> => {
    const { data } = await api.post(QUESTIONS, q);
    return data;
  },
  createAnswer: async (a: Partial<IAnswer>): Promise<IAnswer> => {
    const { data } = await api.post(ANSWERS, a);
    return data;
  },

  // Reports
  createReport: async (r: Partial<IReport>): Promise<IReport> => {
    const { data } = await api.post(REPORT, r);
    return data;
  },
  deleteReport: async (reportId: number): Promise<any> => {
    const { data } = await api.delete(`${REPORT}${reportId}/`);
    return data;
  },
  getAllReports: async (): Promise<IReport[]> => {
    const { data } = await api.get(REPORT);
    return data;
  },
  getUserReports: async (username: string): Promise<IReport[]> => {
    const { data } = await api.get(`${USER_REPORTS}?username=${username}`);
    return data;
  },
  getQuizReport: async (reportId: number) => {
    const { data } = await api.get(QUIZ, { params: { reportId } });
    return data;
  }
};
