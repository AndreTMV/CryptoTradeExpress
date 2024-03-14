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

const createQuiz = async ( quizData: any ) =>
{
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
const quizService = { createQuiz, createAnswer, createQuestion, updateNumberQuestions, renderQuiz, getQuiz, updateQuizStatus, getAllQuizzes }

export default quizService 