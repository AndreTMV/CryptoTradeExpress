import  axios  from 'axios';

const BACKEND_DOMAIN = "http://localhost:8000"
const QUIZ_API = `${BACKEND_DOMAIN}/quiz/api/v1/quiz/`
const QUESTION_API = `${BACKEND_DOMAIN}/quiz/api/v1/questions/`
const ANSWER_API = `${BACKEND_DOMAIN}/quiz/api/v1/answers/`
const RESULT_API = `${BACKEND_DOMAIN}/quiz/api/v1/results/`
const INCREASE_NUMBER_CUESTIONS =`${BACKEND_DOMAIN}/quiz/api/v1/increaseQuestions/` 
const RENDER_QUIZ = `${BACKEND_DOMAIN}/quiz/api/v1/renderQuiz/` 
const GET_QUIZ = `${BACKEND_DOMAIN}/quiz/api/v1/getQuiz/` 
const STATUS_QUIZ = `${BACKEND_DOMAIN}/quiz/api/v1/quizStatus/` 
const REPORT_API = `${BACKEND_DOMAIN}/quiz/api/v1/report/`
const USER_REPORT = `${BACKEND_DOMAIN}/quiz/api/v1/userReports/`
const DELETE_QUESTIONS = `${BACKEND_DOMAIN}/quiz/api/v1/deleteQuestions/`

const createQuiz = async ( quizData: any ) =>{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.post(QUIZ_API, quizData, config)
    return response.data
}

const createQuestion = async ( questionData: any ) =>
{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.post(QUESTION_API, questionData, config)
    return response.data
}

const createAnswer = async ( answerData: any ) =>
{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.post(ANSWER_API, answerData, config)
    return response.data
}

const updateNumberQuestions = async ( quizData: any ) =>
{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.put(INCREASE_NUMBER_CUESTIONS, quizData, config)
    return response.data
}

const renderQuiz = async ( quizData: any ) =>
{
    const config = {
        params: {
            id:quizData.id,
        }

    }
    const response = await axios.get(RENDER_QUIZ, config)
    return response.data
}

const getQuiz = async ( videoData: any ) =>
{
    const config = {
        params: {
            id:videoData.id,
        }

    }
    const response = await axios.get(GET_QUIZ, config)
    return response.data
}

const updateQuizStatus = async ( quizData: any ) =>
{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.put(STATUS_QUIZ, quizData, config)
    return response.data
}

const getAllQuizzes = async (  ) =>
{
   const response = await axios.get(QUIZ_API,) 
   return response.data
}

const createReport = async ( reportData: any ) =>
{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.post(REPORT_API, reportData, config)
    return response.data
}

const deleteReport = async (reportId: number) => {
    const response = await axios.delete(`${REPORT_API}${reportId}/`);
    return response.data;
}

const getAllReports = async () => {
    const response = await axios.get(REPORT_API);
    return response.data;
}

const getUserReports = async ( userData: any ) =>
{
    const config = {
        params: {
            username:userData.username,
        }

    }
    const response = await axios.get(USER_REPORT, config)
    return response.data
}


const getQuizReport = async (reportId: number) => {
    const response = await axios.get(`${QUIZ_API}${reportId}/`);
    return response.data;
}

const deleteQuestions = async (quizId:number) =>
{
    const config = {
        params: {
            id:quizId,
        }

    }
    const response = await axios.delete(DELETE_QUESTIONS, config)
    return response.data

}

const getQuizById = async (quizId: number) => {
    const response = await axios.get(`${QUIZ_API}${quizId}/`);
    return response.data;
};
const quizService = { createQuiz, createAnswer, createQuestion, updateNumberQuestions, renderQuiz, getQuiz, updateQuizStatus, getAllQuizzes, createReport, deleteReport, getAllReports, getUserReports, getQuizReport, deleteQuestions, getQuizById }

export default quizService 