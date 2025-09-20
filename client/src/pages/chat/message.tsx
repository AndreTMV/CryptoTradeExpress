import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import {
  fetchInbox,
  searchUsers,
  reset as chatReset,
} from "../../features/chat/chatSlice";
import type { DMessage, DUserProfile } from "../../features/chat/types";
import moment from "moment";
import { toast } from "react-hot-toast";

const fmtWhen = (iso: string) => moment.utc(iso).local().startOf("seconds").fromNow();

const Inbox: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const meId = useSelector((s: RootState) => s.auth.userInfo?.id);
  const chat = useSelector((s: RootState) => s.chat);
  const { inbox = [], loading, error } = chat;

  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<DUserProfile[]>([]);
  const [searching, setSearching] = React.useState(false);

  // Cargar conversaciones (último mensaje por peer)
  React.useEffect(() => {
    if (!meId) return;
    dispatch(fetchInbox(meId))
      .unwrap()
      .catch((e) => {
        console.error(e);
        toast.error("No se pudo cargar tu bandeja.");
      });
    return () => {
      dispatch(chatReset());
    };
  }, [dispatch, meId]);

  // Debounced search
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }
    const id = window.setTimeout(async () => {
      try {
        setSearching(true);
        const res = await dispatch(searchUsers(query.trim())).unwrap();
        setResults(res || []);
      } catch (e: any) {
        // El backend devuelve 404 cuando no encuentra usuarios
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => window.clearTimeout(id);
  }, [dispatch, query]);

  // Navegar a conversación al elegir resultado
  const goToDM = (peerUserId: number) => {
    navigate(`/inbox/${peerUserId}`);
  };

  // Derivar peerId + nombre a partir del mensaje (último msg del peer)
  const peerInfo = (m: DMessage) => {
    const peerId = m.sender === meId ? m.receiver : m.sender;
    const name =
      m.sender === meId
        ? m.receiver_profile?.name || (m as any).receiver_profile?.username || String(peerId)
        : m.sender_profile?.name || (m as any).sender_profile?.username || String(peerId);
    return { peerId, name };
  };

  return (
    <div className="mx-auto mt-20 max-w-3xl p-3 sm:p-4">
      {/* Header */}
      <div className="mb-3 rounded-2xl bg-white px-4 py-3 shadow ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold tracking-tight text-indigo-900">
            Mensajes
          </h1>
          <Link
            to="/dashboard"
            className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Regresar
          </Link>
        </div>

        {/* Buscador */}
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre, usuario o email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]?.username) {
                goToDM(results[0].username); // username = userId en tu Perfil
              }
            }}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={() => results[0]?.username && goToDM(results[0].username)}
            className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
            disabled={!results.length}
          >
            Abrir
          </button>
        </div>

        {/* Resultados de búsqueda (dropdown simple) */}
        {!!query && (
          <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            {searching ? (
              <div className="p-3 text-sm text-slate-500">Buscando…</div>
            ) : results.length === 0 ? (
              <div className="p-3 text-sm text-slate-500">Sin resultados</div>
            ) : (
              <ul className="divide-y divide-slate-200">
                {results.map((p) => (
                  <li key={p.id} className="p-3 hover:bg-slate-50">
                    <button
                      onClick={() => goToDM(p.username)} // Perfil.username == ID de usuario
                      className="flex w-full items-center justify-between"
                    >
                      <div className="text-left">
                        <div className="text-sm font-semibold text-slate-800">
                          {p.name || String(p.username)}
                        </div>
                        <div className="text-xs text-slate-500">ID: {p.username}</div>
                      </div>
                      <span className="text-xs text-indigo-600">Abrir chat</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Lista de conversaciones */}
      <div className="rounded-2xl bg-white shadow ring-1 ring-slate-200">
        {loading && inbox.length === 0 ? (
          <div className="p-3 sm:p-4">
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-200" />
              ))}
            </div>
          </div>
        ) : inbox.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            Aún no tienes conversaciones. Busca a alguien arriba para empezar.
          </div>
        ) : (
          <ul className="divide-y divide-slate-200">
            {inbox.map((m: DMessage) => {
              const { peerId, name } = peerInfo(m);
              return (
                <li key={m.id}>
                  <Link
                    to={`/inbox/${peerId}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-slate-900">{name}</div>
                        <div className="text-xs text-slate-500">{fmtWhen(m.date)}</div>
                      </div>
                      <div className="mt-0.5 line-clamp-1 text-sm text-slate-600">
                        {m.message}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {error && (
          <div className="border-t border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}
      </div>

      {/* Back (mobile) */}
      <div className="mt-3 text-center sm:hidden">
        <Link
          to="/dashboard"
          className="inline-block rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Regresar
        </Link>
      </div>
    </div>
  );
};

export default Inbox;
