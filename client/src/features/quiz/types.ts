export type QuizStatus = "aceptado" | "pendiente" | "rechazado";
export type QuestionType = "multiple_choice" | "true_false" | "fill_in_the_blank";

export interface IQuiz {
  id: number;
  video: number; // el serializer suele devolver el id
  title: string;
  status: QuizStatus;
  number_of_question: number;
  change_status_date: string; // ISO
}

export interface IQuestion {
  id: number;
  quiz: number;
  question_type: QuestionType;
  text: string;
}

export interface IAnswer {
  id: number;
  question: number;
  text: string;
  correct: boolean;
}

export interface IResult {
  id: number;
  user: number;
  quiz: number;
  score: number;
}

export interface IReport {
  id: number;
  quiz: number;
  title: string;
  description: string;
}

/** Estructura que devuelve /renderQuiz/ */
export interface IRenderedQuiz {
  title: string;
  question: Array<{
    type: QuestionType;
    text: string;
    answers: Array<{ text: string; correct: boolean }>;
  }>;
}
