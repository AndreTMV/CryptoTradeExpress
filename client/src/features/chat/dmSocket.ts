import type {
  DMSocket,
  DMSocketOptions,
  DMIncomingEvent,
  DMOutgoingEvent,
} from "./types";
function joinUrl(a: string, b: string) {
  return `${a.replace(/\/+$/, "")}/${b.replace(/^\/+/, "")}`;
}


function buildUrl(baseWsUrl: string, peerId: number, token?: string): string {
  const base = joinUrl(baseWsUrl, String(peerId)) + "/"; // termina con /
  return token ? `${base}?token=${encodeURIComponent(token)}` : base;
}

export function createDMSocket(opts: DMSocketOptions): DMSocket {
  let socket: WebSocket | null = null;

  // Reconexión opcional (suave). Si no la quieres, deja shouldReconnect siempre en false.
  let shouldReconnect = false;
  let retry = 0;

  const open = () => {
    const url = buildUrl(opts.baseWsUrl, opts.peerId, opts.token);
    // evita doble conexión si ya está OPEN/CONNECTING
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    socket = new WebSocket(url);

    socket.onopen = () => {
      retry = 0;
      opts.onOpen?.();
    };

    socket.onclose = (ev) => {
      opts.onClose?.(ev);

      // Reintento simple con backoff si no fue cierre “limpio”
      if (
        shouldReconnect &&
        socket &&
        ![1000, 1001].includes(ev.code) // 1000 normal, 1001 away
      ) {
        const delay = Math.min(1000 * 2 ** retry, 10000); // 1s,2s,4s,... máx 10s
        retry++;
        setTimeout(() => open(), delay);
      }
    };

    socket.onerror = (ev) => {
      opts.onError?.(ev);
    };

    socket.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as DMIncomingEvent;
        if (!data?.type) return;
        opts.onEvent?.(data);
      } catch {
        // ignora mensajes no-JSON
      }
    };
  };

  const connect = () => {
    shouldReconnect = true; // activa reconexión opcional
    open();
  };

  const close = () => {
    shouldReconnect = false;
    if (socket) {
      try {
        socket.close(1000, "client-close");
      } catch { }
      socket = null;
    }
  };

  const send = (event: DMOutgoingEvent) => {
    const s = socket;
    if (!s || s.readyState !== WebSocket.OPEN) return;
    s.send(JSON.stringify(event));
  };

  const api: DMSocket = {
    get ws() {
      return socket;
    },
    connect,
    close,
    send,
    sendMessage: (text: string) => send({ type: "message", text }),
    fetchHistory: (limit?: number, before_id?: number) =>
      send({ type: "fetch_history", limit, before_id }),
    sendTyping: (isTyping: boolean) => send({ type: "typing", isTyping }),
    markRead: () => send({ type: "read" }),
  };

  return api;
}
