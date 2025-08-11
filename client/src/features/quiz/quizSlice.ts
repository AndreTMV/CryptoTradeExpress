import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import quizService from "./quizService";
import {
  IAnswer,
  IQuestion,
  IQuiz,
  IReport,
  IRenderedQuiz,
  QuizStatus,
} from "./types";

type Reject = string;

interface QuizState {
  quizzes: IQuiz[];
  quiz: IQuiz | null;
  rendered: IRenderedQuiz | null;

  reports: IReport[];

  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string | null;
}

const initialState: QuizState = {
  quizzes: [],
  quiz: null,
  rendered: null,

  reports: [],

  isLoading: false,
  isSuccess: false,
  isError: false,
  message: null,
};

/* ===================== Thunks ===================== */
export const createQuiz = createAsyncThunk<IQuiz, Partial<IQuiz>, { rejectValue: Reject }>(
  "quiz/createQuiz",
  async (payload, thunkAPI) => {
    try {
      return await quizService.createQuiz(payload);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al crear quiz");
    }
  }
);

export const renderQuiz = createAsyncThunk<IRenderedQuiz, number, { rejectValue: Reject }>(
  "quiz/renderQuiz",
  async (quizId, thunkAPI) => {
    try {
      return await quizService.renderQuiz(quizId);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al renderizar quiz");
    }
  }
)

export const getAllQuizzes = createAsyncThunk<IQuiz[], void, { rejectValue: Reject }>(
  "quiz/getAll",
  async (_, thunkAPI) => {
    try {
      return await quizService.getAllQuizzes();
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al cargar quizes");
    }
  }
);

export const getQuizById = createAsyncThunk<IQuiz, number, { rejectValue: Reject }>(
  "quiz/getById",
  async (id, thunkAPI) => {
    try {
      return await quizService.getQuizById(id);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al obtener quiz");
    }
  }
);

export const getQuizByVideo = createAsyncThunk<{ id: number }, number, { rejectValue: Reject }>(
  "quiz/getByVideo",
  async (videoId, thunkAPI) => {
    try {
      return await quizService.getQuizByVideo(videoId);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al buscar quiz por video");
    }
  }
);

export const updateQuizStatus = createAsyncThunk<
  { status: string; message: string; id: number; state: QuizStatus },
  { id: number; state: QuizStatus },
  { rejectValue: Reject }
>("quiz/updateStatus", async (payload, thunkAPI) => {
  try {
    const res = await quizService.updateQuizStatus(payload);
    return { ...res, ...payload };
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al actualizar estado");
  }
});

export const updateNumberQuestions = createAsyncThunk<
  { status: string; message: string; id: number; questions: number },
  { id: number; questions: number },
  { rejectValue: Reject }
>("quiz/updateNumQuestions", async (payload, thunkAPI) => {
  try {
    const res = await quizService.updateNumberQuestions(payload);
    return { ...res, ...payload };
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al actualizar preguntas");
  }
});

export const deleteQuestions = createAsyncThunk<
  { status: string; message: string; quizId: number },
  number,
  { rejectValue: Reject }
>("quiz/deleteQuestions", async (quizId, thunkAPI) => {
  try {
    const res = await quizService.deleteQuestions(quizId);
    return { ...res, quizId };
  } catch (e: any) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al borrar preguntas");
  }
});

export const createQuestion = createAsyncThunk<IQuestion, Partial<IQuestion>, { rejectValue: Reject }>(
  "quiz/createQuestion",
  async (payload, thunkAPI) => {
    try {
      return await quizService.createQuestion(payload);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al crear pregunta");
    }
  }
);

export const createAnswer = createAsyncThunk<IAnswer, Partial<IAnswer>, { rejectValue: Reject }>(
  "quiz/createAnswer",
  async (payload, thunkAPI) => {
    try {
      return await quizService.createAnswer(payload);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al crear respuesta");
    }
  }
);

export const createReport = createAsyncThunk<IReport, Partial<IReport>, { rejectValue: Reject }>(
  "quiz/createReport",
  async (payload, thunkAPI) => {
    try {
      return await quizService.createReport(payload);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al crear reporte");
    }
  }
);

export const deleteReport = createAsyncThunk<number, number, { rejectValue: Reject }>(
  "quiz/deleteReport",
  async (id, thunkAPI) => {
    try {
      await quizService.deleteReport(id);
      return id;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al eliminar reporte");
    }
  }
);

export const getAllReports = createAsyncThunk<IReport[], void, { rejectValue: Reject }>(
  "quiz/getAllReports",
  async (_, thunkAPI) => {
    try {
      return await quizService.getAllReports();
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al cargar reportes");
    }
  }
);

export const getUserReports = createAsyncThunk<IReport[], string, { rejectValue: Reject }>(
  "quiz/getUserReports",
  async (username, thunkAPI) => {
    try {
      return await quizService.getUserReports(username);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al cargar reportes de usuario");
    }
  }
);

export const getQuizReport = createAsyncThunk<IReport[], number, { rejectValue: Reject }>(
  "quiz/getQuizReports",
  async (reportId: number, thunkAPI) => {
    try {
      return await quizService.getQuizReport(reportId);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al cargar reportes de quiz");
    }
  }
);

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = null;
    },
    clearRendered: (state) => {
      state.rendered = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createQuiz
      .addCase(createQuiz.pending, (s) => {
        s.isLoading = true;
      })
      .addCase(createQuiz.fulfilled, (s, a: PayloadAction<IQuiz>) => {
        s.isLoading = false;
        s.isSuccess = true;
        s.quiz = a.payload;
        s.quizzes.push(a.payload);
      })
      .addCase(createQuiz.rejected, (s, a) => {
        s.isLoading = false;
        s.isError = true;
        s.message = a.payload ?? "Error al crear quiz";
      })

      // getAllQuizzes
      .addCase(getAllQuizzes.pending, (s) => {
        s.isLoading = true;
      })
      .addCase(getAllQuizzes.fulfilled, (s, a: PayloadAction<IQuiz[]>) => {
        s.isLoading = false;
        s.quizzes = a.payload;
      })
      .addCase(getAllQuizzes.rejected, (s, a) => {
        s.isLoading = false;
        s.isError = true;
        s.message = a.payload ?? "Error al cargar quizes";
      })

      // getQuizById
      .addCase(getQuizById.fulfilled, (s, a: PayloadAction<IQuiz>) => {
        s.quiz = a.payload;
      })

      // status / number questions
      .addCase(updateQuizStatus.fulfilled, (s, a) => {
        s.isSuccess = true;
        const q = s.quizzes.find((x) => x.id === a.payload.id);
        if (q) q.status = a.payload.state;
      })
      .addCase(updateNumberQuestions.fulfilled, (s, a) => {
        s.isSuccess = true;
        const q = s.quizzes.find((x) => x.id === a.payload.id);
        if (q) q.number_of_question = a.payload.questions;
      })

      // renderQuiz
      .addCase(renderQuiz.pending, (s) => {
        s.isLoading = true;
        s.rendered = null;
      })
      .addCase(renderQuiz.fulfilled, (s, a: PayloadAction<IRenderedQuiz>) => {
        s.isLoading = false;
        s.rendered = a.payload;
      })
      .addCase(renderQuiz.rejected, (s, a) => {
        s.isLoading = false;
        s.isError = true;
        s.message = a.payload ?? "Error al renderizar quiz";
      })

      // deleteQuestions
      .addCase(deleteQuestions.fulfilled, (s) => {
        s.isSuccess = true;
      })

      // Q&A creation feedback
      .addCase(createQuestion.fulfilled, (s) => {
        s.isSuccess = true;
      })
      .addCase(createAnswer.fulfilled, (s) => {
        s.isSuccess = true;
      })

      // Reports
      .addCase(createReport.fulfilled, (s, a: PayloadAction<IReport>) => {
        s.isSuccess = true;
        s.reports.push(a.payload);
      })
      .addCase(deleteReport.fulfilled, (s, a: PayloadAction<number>) => {
        s.isSuccess = true;
        s.reports = s.reports.filter((r) => r.id !== a.payload);
      })
      .addCase(getAllReports.fulfilled, (s, a: PayloadAction<IReport[]>) => {
        s.reports = a.payload;
      })
      .addCase(getUserReports.fulfilled, (s, a: PayloadAction<IReport[]>) => {
        s.reports = a.payload;
      })
      .addCase(getQuizReport.fulfilled, (s, a: PayloadAction<IReport[]>) => {
        s.reports = a.payload;
      })

      // errores genéricos
      .addMatcher(
        (action) => action.type.startsWith("quiz/") && action.type.endsWith("/rejected"),
        (s, a: any) => {
          s.isLoading = false;
          s.isError = true;
          s.message = a.payload ?? "Ocurrió un error";
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("quiz/") && action.type.endsWith("/pending"),
        (s) => {
          s.isLoading = true;
          s.isError = false;
          s.isSuccess = false;
          s.message = null;
        }
      );
  },
});

export const { reset, clearRendered } = quizSlice.actions;
export default quizSlice.reducer;
