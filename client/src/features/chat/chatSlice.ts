import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import chatService from "./chatService";
import type {
  ChatMessage,
  GetMessagesDTO,
  SendMessageDTO,
  PerfilPreview,
} from "./types";

type Reject = string;

interface ChatState {
  inbox: ChatMessage[];        // últimas conversaciones (último mensaje por peer)
  thread: ChatMessage[];       // historial de la conversación activa (ascendente por fecha)
  search: PerfilPreview[];     // resultados de búsqueda
  activePeerId: number | null; // peer seleccionado
  loading: boolean;
  sending: boolean;
  error: string | null;

  // realtime
  wsConnected: boolean;
  typingFromPeer: boolean;
}

const initialState: ChatState = {
  inbox: [],
  thread: [],
  search: [],
  activePeerId: null,
  loading: false,
  sending: false,
  error: null,
  wsConnected: false,
  typingFromPeer: false,
};

// ---- Thunks REST ----
export const fetchInbox = createAsyncThunk<ChatMessage[], number, { rejectValue: Reject }>(
  "chat/fetchInbox",
  async (userId, thunkAPI) => {
    try {
      return await chatService.getMyMessages(userId);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al cargar bandeja");
    }
  }
);

export const fetchThread = createAsyncThunk<ChatMessage[], GetMessagesDTO, { rejectValue: Reject }>(
  "chat/fetchThread",
  async ({ senderId, receiverId }, thunkAPI) => {
    try {
      return await chatService.getMessages(senderId, receiverId);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al cargar mensajes");
    }
  }
);

export const postMessage = createAsyncThunk<ChatMessage, SendMessageDTO, { rejectValue: Reject }>(
  "chat/postMessage",
  async (payload, thunkAPI) => {
    try {
      return await chatService.sendMessage(payload);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "No se pudo enviar el mensaje");
    }
  }
);

export const searchUsers = createAsyncThunk<PerfilPreview[], string, { rejectValue: Reject }>(
  "chat/searchUsers",
  async (username, thunkAPI) => {
    try {
      return await chatService.searchUser(username);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al buscar usuarios");
    }
  }
);

// ---- Utils locales para reducers ----
function samePair(a: ChatMessage, b: ChatMessage): boolean {
  const p1 = [a.sender, a.receiver].sort().join("-");
  const p2 = [b.sender, b.receiver].sort().join("-");
  return p1 === p2;
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    reset: (s) => {
      s.loading = false;
      s.sending = false;
      s.error = null;
      s.typingFromPeer = false;
      s.wsConnected = false; // la vista cierra el socket al desmontar
    },
    setActivePeer: (s, a: PayloadAction<number | null>) => {
      s.activePeerId = a.payload;
      s.thread = [];          // limpiamos hilo, se volverá a cargar
      s.typingFromPeer = false;
    },
    // realtime flags
    setWsConnected: (s, a: PayloadAction<boolean>) => {
      s.wsConnected = a.payload;
    },
    setTypingFromPeer: (s, a: PayloadAction<boolean>) => {
      s.typingFromPeer = a.payload;
    },
    // eventos entrantes WS
    appendIncomingMessage: (s, a: PayloadAction<ChatMessage>) => {
      const msg = a.payload;

      // 1) Evita duplicados en thread
      if (!s.thread.some(m => m.id === msg.id)) {
        s.thread.push(msg); // llegan en tiempo real (al final)
      }

      // 2) Upsert en inbox (por par de usuarios)
      const idx = s.inbox.findIndex(m => samePair(m, msg));
      if (idx >= 0) {
        s.inbox[idx] = msg;
      } else {
        s.inbox.unshift(msg);
      }
    },
    prependHistory: (s, a: PayloadAction<ChatMessage[]>) => {
      // Llega historial (más antiguo primero). Prepend evitando duplicados.
      if (!a.payload?.length) return;
      const existing = new Set(s.thread.map(m => m.id));
      const fresh = a.payload.filter(m => !existing.has(m.id));
      s.thread = [...fresh, ...s.thread];
    },
    markReadByPeer: (s, a: PayloadAction<{ reader: number }>) => {
      const reader = a.payload.reader;

      // Marcar como leídos en el hilo: todos los mensajes que el 'reader' recibió.
      // (i.e., receiver === reader)
      for (const m of s.thread) {
        if (m.receiver === reader) {
          m.is_read = true;
        }
      }

      // Actualiza también el último de inbox si corresponde
      for (let i = 0; i < s.inbox.length; i++) {
        const m = s.inbox[i];
        if (m.receiver === reader) {
          s.inbox[i] = { ...m, is_read: true };
        }
      }
    },
  },
  extraReducers: (b) => {
    b
      // Inbox
      .addCase(fetchInbox.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchInbox.fulfilled, (s, a) => { s.loading = false; s.inbox = a.payload; })
      .addCase(fetchInbox.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Error"; })

      // Thread
      .addCase(fetchThread.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchThread.fulfilled, (s, a) => {
        s.loading = false;
        // Asegura orden ascendente por fecha (por si acaso)
        s.thread = [...a.payload].sort((x, y) => new Date(x.date).getTime() - new Date(y.date).getTime());
      })
      .addCase(fetchThread.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Error"; })

      // Send
      .addCase(postMessage.pending, (s) => { s.sending = true; s.error = null; })
      .addCase(postMessage.fulfilled, (s, a) => {
        s.sending = false;
        // Evita duplicado si también llega por WS
        if (!s.thread.some(m => m.id === a.payload.id)) {
          s.thread.push(a.payload);
        }
        // Upsert en inbox
        const idx = s.inbox.findIndex(m => samePair(m, a.payload));
        if (idx >= 0) s.inbox[idx] = a.payload; else s.inbox.unshift(a.payload);
      })
      .addCase(postMessage.rejected, (s, a) => { s.sending = false; s.error = a.payload || "Error"; })

      // Search
      .addCase(searchUsers.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(searchUsers.fulfilled, (s, a) => { s.loading = false; s.search = a.payload; })
      .addCase(searchUsers.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Error"; });
  },
});

export const {
  reset,
  setActivePeer,
  setWsConnected,
  setTypingFromPeer,
  appendIncomingMessage,
  prependHistory,
  markReadByPeer,
} = chatSlice.actions;

export default chatSlice.reducer;
