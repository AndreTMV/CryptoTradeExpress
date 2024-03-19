import  axios  from 'axios';

const BACKEND_DOMAIN = "http://localhost:8000"
const CHAT_API = `${BACKEND_DOMAIN}/chat/api/v1/`
const GET_MESSAGES = `${BACKEND_DOMAIN}/chat/my-message/`
const GET_MESSAGES_USERS = `${BACKEND_DOMAIN}/chat/get-message/`
const SEND_MESSAGE = `${BACKEND_DOMAIN}/chat/send-message/`
const SEARCH_USER = `${BACKEND_DOMAIN}/chat/search/`


const getMyMessages = async (userId: number) => {
    const response = await axios.get(`${GET_MESSAGES}${userId}/`);
    return response.data;
}

const getMessages = async (senderId: number, receiverId:number) => {
    const response = await axios.get(`${GET_MESSAGES_USERS}${senderId}/${receiverId}/`);
    return response.data;
}

const sendMessage = async (messageData:any) => {
    const response = await axios.post(SEND_MESSAGE, messageData);
    return response.data;
}

const searchUser = async (username:any) => {
    const response = await axios.get(`${SEARCH_USER}${username}/`);
    return response.data;
}



const chatService = { getMyMessages, getMessages, sendMessage, searchUser }

export default chatService 