import React from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import {
  fetchThread,
  reset as chatReset,
  setActivePeer,
  setWsConnected,
  setTypingFromPeer,
  appendIncomingMessage,
  prependHistory,
  markReadByPeer,
} from "../../features/chat/chatSlice";
import type { DMIncomingEvent, ChatMessage } from "../../features/chat/types";
import { getWsBase } from "../../api/axiosInstance";
import { toast } from "react-hot-toast";
import moment from "moment";

/** Formatea fecha: si es >2 días, DD/MM/YYYY; si no hh:mm A */
const fmtTime = (iso: string) => {
  const d = moment.utc(iso);
  const now = moment();
  return now.diff(d, "days") > 2 ? d.local().format("DD/MM/YYYY") : d.local().format("hh:mm A");
};

const MessageDetail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();

  const meId = useSelector((s: RootState) => s.auth.userInfo?.id ?? null);
  const accesToken = (useSelector((s: RootState) => s.auth.userState?.access as string));
  const { thread = [], loading, typingFromPeer, wsConnected, error } = useSelector(
    (s: RootState) => s.chat
  );

  const peerId = React.useMemo(() => {
    const n = Number(id);
    return Number.isFinite(n) ? n : null;
  }, [id]);

  const [text, setText] = React.useState("");
  const bottomRef = React.useRef<HTMLDivElement | null>(null);
  const wsRef = React.useRef<WebSocket | null>(null);

  // peer activo + histórico (REST) una sola vez
  React.useEffect(() => {
    if (!meId || !peerId) return;
    dispatch(setActivePeer(peerId));
    dispatch(fetchThread({ senderId: meId, receiverId: peerId })).catch(() => { });
    return () => {
      dispatch(chatReset());
    };
  }, [dispatch, meId, peerId]);

  // Conexión WebSocket (sólo WS para enviar/recibir)
  React.useEffect(() => {
    if (!meId || !peerId || !accesToken) return;

    const WS_BASE = getWsBase(); // ej. ws://127.0.0.1:8000 (o derivado de VITE_API_URL)
    const url = `${WS_BASE}/ws/chat/dm/${peerId}/?token=${encodeURIComponent(accesToken)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      dispatch(setWsConnected(true));
      // marca como leído al conectar (opcional)
      try {
        ws.send(JSON.stringify({ type: "read" }));
      } catch {/* */ }
    };

    ws.onclose = (ev) => {
      dispatch(setWsConnected(false));
      // Códigos de cierre útiles de tu consumer: 4001..4004
      if (ev.code === 4001) toast.error("No autenticado (token inválido o ausente).");
      if (ev.code === 4002) toast.error("peer_id inválido en la URL del WS.");
      if (ev.code === 4003) toast.error("No puedes abrir DM contigo mismo.");
      if (ev.code === 4004) toast.error("El usuario destino no existe.");
      // Log de diagnóstico
      console.warn("WS closed", { code: ev.code, reason: ev.reason });
    };

    ws.onerror = () => {
      toast.error("Error en la conexión del chat");
    };

    ws.onmessage = (ev) => {
      try {
        const evt: DMIncomingEvent = JSON.parse(ev.data);
        switch (evt.type) {
          case "message":
            if (evt.payload) dispatch(appendIncomingMessage(evt.payload as ChatMessage));
            break;
          case "history":
            if (Array.isArray(evt.payload)) dispatch(prependHistory(evt.payload as ChatMessage[]));
            break;
          case "typing":
            dispatch(setTypingFromPeer(Boolean((evt as any).payload?.isTyping)));
            break;
          case "read":
            if (evt.payload) dispatch(markReadByPeer(evt.payload));
            break;
          case "error":
            toast.error(evt.error || "Error de socket");
            break;
        }
      } catch {
        // mensaje no JSON o formato desconocido
      }
    };

    // marca como leído poco después de conectar
    const markTimer = setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({ type: "read" }));
        } catch {/* */ }
      }
    }, 400);

    return () => {
      clearTimeout(markTimer);
      try {
        ws.close();
      } catch { /* */ }
      wsRef.current = null;
    };
  }, [dispatch, meId, peerId, accesToken]);

  // typing (debounce)
  const typingTimerRef = React.useRef<number | undefined>(undefined);
  const onInputChange = (v: string) => {
    setText(v);
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: "typing", isTyping: true }));
    window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = window.setTimeout(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current?.send(JSON.stringify({ type: "typing", isTyping: false }));
      }
    }, 900);
  };

  // Enviar por WS (no REST, para evitar duplicados)
  const handleSend = () => {
    const msg = text.trim();
    if (!msg) return;
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      toast.error("Chat desconectado. Reintenta en unos segundos.");
      return;
    }
    ws.send(JSON.stringify({ type: "message", text: msg }));
    setText("");
    // opcional: marcar leído
    ws.send(JSON.stringify({ type: "read" }));
  };

  // Enter para enviar
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto scroll al último
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [thread.length]);

  // Nombre del peer
  const peerName = React.useMemo(() => {
    if (!peerId) return "Chat";
    for (const m of thread) {
      if (m.sender === peerId)
        return m.sender_profile?.name || m.sender_profile?.username || String(peerId);
      if (m.receiver === peerId)
        return m.receiver_profile?.name || m.receiver_profile?.username || String(peerId);
    }
    return String(peerId);
  }, [peerId, thread]);

  return (
    <div className="mx-auto mt-20 max-w-3xl p-3 sm:p-4">
      {/* Header */}
      <div className="sticky top-16 z-10 mb-3 rounded-2xl bg-white px-4 py-3 shadow ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-indigo-900">{peerName}</div>
            <div className="text-xs text-slate-500">
              {wsConnected ? (
                <span className="inline-flex items-center gap-1">
                  <span className="size-2 rounded-full bg-green-500" /> Conectado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <span className="size-2 rounded-full bg-slate-300" /> Desconectado
                </span>
              )}
              {typingFromPeer && <span className="ml-2 italic text-slate-400">escribiendo…</span>}
            </div>
          </div>
          <Link
            to="/inbox"
            className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Regresar
          </Link>
        </div>
      </div>

      {/* Chat card */}
      <div className="rounded-2xl bg-white shadow ring-1 ring-slate-200">
        {/* Mensajes */}
        <div className="max-h-[60vh] overflow-y-auto p-3 sm:p-4">
          {loading && thread.length === 0 ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-6 w-2/3 animate-pulse rounded bg-slate-200" />
              ))}
            </div>
          ) : thread.length === 0 ? (
            <div className="py-16 text-center text-slate-500">No hay mensajes todavía.</div>
          ) : (
            <ul className="space-y-2">
              {thread.map((m) => {
                const mine = m.sender === meId;
                return (
                  <li key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow ${mine
                        ? "bg-indigo-600 text-white ring-1 ring-indigo-500/40"
                        : "bg-slate-100 text-slate-800 ring-1 ring-slate-200"
                        }`}
                    >
                      {!mine && (
                        <div className="mb-0.5 text-xs font-semibold text-slate-600">
                          {m.sender_profile?.name || m.sender_profile?.username}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap break-words">{m.message}</div>
                      <div
                        className={`mt-1 text-[10px] ${mine ? "text-indigo-100/80" : "text-slate-500"
                          }`}
                      >
                        {fmtTime(m.date)}
                      </div>
                    </div>
                  </li>
                );
              })}
              <div ref={bottomRef} />
            </ul>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 p-3 sm:p-4">
          <div className="flex items-end gap-2">
            <input
              id="text-input"
              type="text"
              value={text}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Escribe tu mensaje…"
              className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleSend}
              disabled={!text.trim() || !wsConnected}
              className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Enviar
            </button>
          </div>
          {error && <div className="mt-2 text-xs text-rose-600">{error}</div>}
        </div>
      </div>

      {/* Back (mobile) */}
      <div className="mt-3 text-center sm:hidden">
        <Link
          to="/inbox"
          className="inline-block rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Regresar
        </Link>
      </div>
    </div>
  );
};

export default MessageDetail;
