export interface PerfilPreview {
  id: number;
  username: string;
  name?: string | null;
}

export interface ChatMessage {
  id: number;
  user: number;
  sender: number;
  receiver: number;
  message: string;
  is_read: boolean;
  date: string;
  sender_profile?: PerfilPreview;
  receiver_profile?: PerfilPreview;
}

export type InboxItem = ChatMessage;

export type ThreadMessage = ChatMessage;

export interface GetMyMessagesDTO {
  userId: number;
}

export interface GetMessagesDTO {
  senderId: number;   // yo
  receiverId: number; // peer
}

export interface SendMessageDTO {
  user: number;       // igual a sender en tu modelo
  sender: number;
  receiver: number;
  message: string;
}

export interface SearchUserDTO {
  username: string;
}

// -------- WebSocket payloads --------
export type DMIncomingEvent =
  | { type: "message"; payload: ChatMessage }
  | { type: "history"; payload: ChatMessage[] }
  | { type: "typing"; payload: { user: number; isTyping: boolean } }
  | { type: "read"; payload: { reader: number } }
  | { type: "error"; error: string };

export type DMOutgoingEvent =
  | { type: "message"; text: string }
  | { type: "fetch_history"; limit?: number; before_id?: number }
  | { type: "typing"; isTyping: boolean }
  | { type: "read" };

export interface DMSocketOptions {
  baseWsUrl: string;
  token?: string;
  peerId: number;
  onOpen?: () => void;
  onClose?: (ev: CloseEvent) => void;
  onError?: (ev: Event) => void;
  onEvent?: (evt: DMIncomingEvent) => void;
}

export interface DMSocket {
  ws: WebSocket | null;
  connect: () => void;
  close: () => void;
  send: (event: DMOutgoingEvent) => void;
  sendMessage: (text: string) => void;
  fetchHistory: (limit?: number, beforeId?: number) => void;
  sendTyping: (isTyping: boolean) => void;
  markRead: () => void;
}
