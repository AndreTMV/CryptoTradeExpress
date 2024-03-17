import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import quizService from './quizService';

interface QuizState {
    quiz: any;
    question: any,
    answer: any,
    report: any,
    quizIsError: boolean;
    quizIsSuccess: boolean;
    quizIsLoading: boolean;
    quizMessage: string;
    allQuizzesLoaded: boolean;
}

const initialState: QuizState = {
    quiz: {},
    question: {},
    answer: {},
    report:{},
    quizIsError: false,
    quizIsSuccess: false,
    quizIsLoading: false,
    quizMessage: '',
    allQuizzesLoaded: false,
};

export const createQuiz = createAsyncThunk(
    "quiz/createQuiz",
    async (quizData: any, thunkAPI) => {
        try {
            return await quizService.createQuiz(quizData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const createQuestion = createAsyncThunk(
    "quiz/createQuestion",
    async (questionData: any, thunkAPI) => {
        try {
            return await quizService.createQuestion(questionData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const createAnswer = createAsyncThunk(
    "quiz/createAnswer",
    async (answerData: any, thunkAPI) => {
        try {
            return await quizService.createAnswer(answerData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const updateNumberQuestions = createAsyncThunk(
    "quiz/updateNumberQuestions",
    async ( quizData: any, thunkAPI ) =>
    {
        try
        {
            return await quizService.updateNumberQuestions(quizData)
        } catch ( error )
        {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const renderQuiz = createAsyncThunk(
    "quiz/renderQuiz",
    async ( quizData: any, thunkAPI ) =>
    {
        try
        {
            return await quizService.renderQuiz(quizData)
        } catch ( error )
        {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getQuiz = createAsyncThunk(
    "quiz/getQuiz",
    async ( videoData: any, thunkAPI ) =>
    {
        try
        {
            return await quizService.getQuiz(videoData)
        } catch ( error )
        {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const updateQuizStatus = createAsyncThunk(
    "quiz/updateQuizStatus",
    async ( quizData: any, thunkAPI ) =>
    {
        try
        {
            return await quizService.updateQuizStatus(quizData)
        } catch ( error )
        {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getAllQuizzes = createAsyncThunk(
    "quiz/getQuizzes",
    async ( thunkAPI ) =>
    {
        try
        {
            return await quizService.getAllQuizzes()
        } catch ( error )
        {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)
export const createReport = createAsyncThunk(
    "quiz/createReport",
    async (reportData: any, thunkAPI) => {
        try {
            return await quizService.createReport(reportData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const deleteReport = createAsyncThunk(
    "videos/deleteReport",
    async (reportData, thunkAPI) => {
        try {
            const id = reportData.id;
            return await quizService.deleteReport(id)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getAllReports = createAsyncThunk(
    "quiz/getAllReports",
    async ( thunkAPI ) =>
    {
        try
        {
            return await quizService.getAllReports()
        } catch ( error )
        {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getUserReports = createAsyncThunk(
    "quiz/getUserReports",
    async ( userData: any, thunkAPI ) =>
    {
        try
        {
            return await quizService.getUserReports(userData)
        } catch ( error )
        {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)
export const getQuizReport = createAsyncThunk(
    "quiz/getQuizReport",
    async (reportData, thunkAPI) => {
        try {
            const id = reportData.id;
            return await quizService.getQuizReport(id)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const deleteQuestions = createAsyncThunk(
    "quiz/deleteQuestions",
    async ( quizData, thunkAPI ) =>
    { 
        try
        {
            const id = quizData.id
            return await quizService.deleteQuestions(id)
        } catch ( error )
        {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const fetchQuizById = createAsyncThunk(
    "quiz/fetchQuizById",
    async (quizId: number, thunkAPI) => {
        try {
            return await quizService.getQuizById(quizId);
        } catch (error) {
            const message = (error.response && error.response.data &&
                error.response.data.message) || error.message || error.toString();

            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        reset: (state) => {
            state.quizIsLoading = false
            state.quizIsError = false
            state.quizIsSuccess = false
            state.quizMessage = ''
            state.allQuizzesLoaded = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase( createQuiz.pending, ( state ) =>
            {
                state.quizIsLoading = true
            })
            .addCase( createQuiz.fulfilled, ( state, action ) =>
            {
                state.quizIsSuccess = true,
                state.quizIsLoading = false
                state.quiz = action.payload
            })
            .addCase( createQuiz.rejected, ( state, action) =>
            {
                state.quizIsError = true,
                state.quizIsLoading = false,
                state.quizIsSuccess = false,
                state.quizMessage = action.payload
            })
            .addCase( createQuestion.pending, ( state ) =>
            {
                state.quizIsLoading = true
            })
            .addCase( createQuestion.fulfilled, ( state, action ) =>
            {
                state.quizIsSuccess = true,
                state.quizIsLoading = false
                state.question = action.payload
            })
            .addCase( createQuestion.rejected, ( state, action) =>
            {
                state.quizIsError = true,
                state.quizIsLoading = false,
                state.quizIsSuccess = false,
                state.quizMessage = action.payload
            })
            .addCase( createAnswer.pending, ( state ) =>
            {
                state.quizIsLoading = true
            })
            .addCase( createAnswer.fulfilled, ( state, action ) =>
            {
                state.quizIsSuccess = true,
                state.quizIsLoading = false
                state.answer = action.payload
            })
            .addCase( createAnswer.rejected, ( state, action) =>
            {
                state.quizIsError = true,
                state.quizIsLoading = false,
                state.quizIsSuccess = false,
                state.quizMessage = action.payload
            })
            .addCase(updateNumberQuestions.pending, (state) => {
                state.quizIsLoading = true
            })
            .addCase(updateNumberQuestions.fulfilled, (state) => {
                state.quizIsLoading = false
                state.quizIsSuccess = true
            })
            .addCase(updateNumberQuestions.rejected, (state, action) => {
                state.quizIsLoading = false
                state.quizIsSuccess = false
                state.quizIsError = true
                state.quizMessage = action.payload
            })
            .addCase( renderQuiz.pending, ( state ) =>
            {
                state.quizIsLoading = true
            })
            .addCase( renderQuiz.fulfilled, ( state, action ) =>
            {
                state.quizIsSuccess = true,
                state.quizIsLoading = false
                state.quiz = action.payload
            })
            .addCase( renderQuiz.rejected, ( state, action) =>
            {
                state.quizIsError = true,
                state.quizIsLoading = false,
                state.quizIsSuccess = false,
                state.quizMessage = action.payload
            })
            .addCase( getQuiz.pending, ( state ) =>
            {
                state.quizIsLoading = true
            })
            .addCase( getQuiz.fulfilled, ( state, action ) =>
            {
                state.quizIsSuccess = true,
                state.quizIsLoading = false
            })
            .addCase( getQuiz.rejected, ( state, action) =>
            {
                state.quizIsError = true,
                state.quizIsLoading = false,
                state.quizIsSuccess = false,
                state.quizMessage = action.payload
            })
            .addCase(updateQuizStatus.pending, (state) => {
                state.quizIsLoading = true
            })
            .addCase(updateQuizStatus.fulfilled, (state) => {
                state.quizIsLoading = false
                state.quizIsSuccess = true
            })
            .addCase(updateQuizStatus.rejected, (state, action) => {
                state.quizIsLoading = false
                state.quizIsSuccess = false
                state.quizIsError = true
                state.quizMessage = action.payload
            })
            .addCase(getAllQuizzes.pending, (state) => {
                state.quizIsLoading = true
            })
            .addCase(getAllQuizzes.fulfilled, (state, action) => {
                state.quizIsLoading = false
                state.allQuizzesLoaded = true
                state.quiz = action.payload
            })
            .addCase(getAllQuizzes.rejected, (state, action) => {
                state.quizIsLoading = false
                state.allQuizzesLoaded = false
                state.quizIsError = true
                state.quizMessage = action.payload
            })
            .addCase( createReport.pending, ( state ) =>
            {
                state.quizIsLoading = true
            })
            .addCase( createReport.fulfilled, ( state, action ) =>
            {
                state.quizIsSuccess = true,
                state.quizIsLoading = false
                state.report = action.payload
            })
            .addCase( createReport.rejected, ( state, action) =>
            {
                state.quizIsError = true,
                state.quizIsLoading = false,
                state.quizIsSuccess = false,
                state.quizMessage = action.payload
            })
            .addCase(deleteReport.pending, (state) => {
                state.quizIsLoading = true
            })
            .addCase(deleteReport.fulfilled, (state) => {
                state.quizIsLoading = false
                state.quizIsSuccess = true
            })
            .addCase(deleteReport.rejected, (state, action) => {
                state.quizIsLoading = false
                state.quizIsSuccess = false
                state.quizIsError = true
                state.quizMessage = action.payload
            })
            .addCase(getAllReports.pending, (state) => {
                state.quizIsLoading = true
            })
            .addCase(getAllReports.fulfilled, (state, action) => {
                state.quizIsLoading = false
                state.allQuizzesLoaded = true
                state.report = action.payload
            })
            .addCase(getAllReports.rejected, (state, action) => {
                state.quizIsLoading = false
                state.allQuizzesLoaded = false
                state.quizIsError = true
                state.quizMessage = action.payload
            })
            .addCase( getUserReports.pending, ( state ) =>
            {
                state.quizIsLoading = true
            })
            .addCase( getUserReports.fulfilled, ( state, action ) =>
            {
                state.quizIsSuccess = true,
                state.quizIsLoading = false
                state.allQuizzesLoaded = true
                state.report = action.payload
            })
            .addCase( getUserReports.rejected, ( state, action) =>
            {
                state.quizIsError = true,
                state.quizIsLoading = false,
                state.quizIsSuccess = false,
                state.allQuizzesLoaded = false
                state.quizMessage = action.payload
            })
            .addCase( getQuizReport.pending, ( state ) =>
            {
                state.quizIsLoading = true
            })
            .addCase( getQuizReport.fulfilled, ( state, action ) =>
            {
                state.quizIsSuccess = true,
                state.quizIsLoading = false
            })
            .addCase( getQuizReport.rejected, ( state, action) =>
            {
                state.quizIsError = true,
                state.quizIsLoading = false,
                state.quizIsSuccess = false,
                state.quizMessage = action.payload
            })
            .addCase(deleteQuestions.pending, (state) => {
                state.quizIsLoading = true
            })
            .addCase(deleteQuestions.fulfilled, (state) => {
                state.quizIsLoading = false
                state.quizIsSuccess = true
            })
            .addCase(deleteQuestions.rejected, (state, action) => {
                state.quizIsLoading = false
                state.quizIsSuccess = false
                state.quizIsError = true
                state.quizMessage = action.payload
            })
            .addCase( fetchQuizById.pending, ( state ) =>
            {
                state.quizIsLoading = true
            })
            .addCase( fetchQuizById.fulfilled, ( state, action ) =>
            {
                state.quizIsSuccess = true,
                state.quizIsLoading = false
                state.quiz = action.payload
            })
            .addCase( fetchQuizById.rejected, ( state, action) =>
            {
                state.quizIsError = true,
                state.quizIsLoading = false,
                state.quizIsSuccess = false,
                state.quizMessage = action.payload
            })
    }
})

export const { reset } = quizSlice.actions

export default quizSlice.reducer