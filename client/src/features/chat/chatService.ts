import api from "../../api/axiosInstance";
import type {
  ChatMessage,
  SendMessageDTO,
  PerfilPreview,
} from "./types";

const MY_MESSAGES = "/chat/my-message";            // /chat/my-message/<user_id>/
const GET_MESSAGES = "/chat/get-message";          // /chat/get-message/<sender>/<receiver>/
const SEND_MESSAGE = "/chat/send-message/";        // POST
const SEARCH = "/chat/search";                     // /chat/search/<username>/

export async function getMyMessages(userId: number): Promise<ChatMessage[]> {
  const { data } = await api.get<ChatMessage[]>(`${MY_MESSAGES}/${userId}/`);
  return data;
}

export async function getMessages(
  senderId: number,
  receiverId: number
): Promise<ChatMessage[]> {
  const { data } = await api.get<ChatMessage[]>(
    `${GET_MESSAGES}/${senderId}/${receiverId}/`
  );
  return data;
}

export async function sendMessage(payload: SendMessageDTO): Promise<ChatMessage> {
  const { data } = await api.post<ChatMessage>(SEND_MESSAGE, payload);
  return data;
}

export async function searchUser(username: string): Promise<PerfilPreview[]> {
  const { data } = await api.get<PerfilPreview[]>(`${SEARCH}/${encodeURIComponent(username)}/`);
  return data;
}

const chatService = { getMyMessages, getMessages, sendMessage, searchUser };
export default chatService;
