import  axios  from 'axios';

const BACKEND_DOMAIN = "http://localhost:8000"
const QUIZ_API = `${BACKEND_DOMAIN}/quiz/api/v1/quiz/`
const QUESTION_API = `${BACKEND_DOMAIN}/quiz/api/v1/questions/`
const ANSWER_API = `${BACKEND_DOMAIN}/quiz/api/v1/answers/`
const RESULT_API = `${BACKEND_DOMAIN}/quiz/api/v1/results/`

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

const quizService = { createQuiz, createAnswer, createQuestion }

export default quizService 