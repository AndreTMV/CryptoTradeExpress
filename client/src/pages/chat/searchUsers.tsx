import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { searchUsers, reset as chatReset } from "../../features/chat/chatSlice";
import type { DUserProfile } from "../../features/chat/types";
import { toast } from "react-hot-toast";

type RouteParams = { username?: string };

const SearchUsers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { username } = useParams<RouteParams>();

  const [query, setQuery] = React.useState<string>(username ?? "");
  const [results, setResults] = React.useState<DUserProfile[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [touched, setTouched] = React.useState<boolean>(false);

  // Dispara búsqueda con debounce cuando cambia query o param
  React.useEffect(() => {
    setQuery(username ?? "");
  }, [username]);

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const id = window.setTimeout(async () => {
      try {
        setLoading(true);
        const data = await dispatch(searchUsers(query.trim())).unwrap();
        setResults(Array.isArray(data) ? data : []);
        setTouched(true);
      } catch (e: any) {
        // backend podría responder 404 cuando no hay usuarios
        setResults([]);
        setTouched(true);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(id);
  }, [dispatch, query]);

  React.useEffect(() => {
    return () => {
      dispatch(chatReset());
    };
  }, [dispatch]);

  const runSearch = () => {
    if (!query.trim()) {
      toast.error("Escribe algo para buscar.");
      return;
    }
    // sincroniza la URL con la búsqueda
    navigate(`/search/${encodeURIComponent(query.trim())}`);
  };

  const goToDM = (peerUserId: number) => {
    navigate(`/inbox/${peerUserId}`);
  };

  return (
    <div className="mx-auto mt-20 max-w-3xl p-3 sm:p-4">
      {/* Header */}
      <div className="mb-3 rounded-2xl bg-white px-4 py-3 shadow ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold tracking-tight text-indigo-900">
            Buscar usuarios
          </h1>
          <Link
            to="/inbox"
            className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Regresar
          </Link>
        </div>

        {/* Search bar */}
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            placeholder="Nombre, usuario o email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSearch();
            }}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={runSearch}
            className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white shadow hover:bg-indigo-700"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-2xl bg-white shadow ring-1 ring-slate-200">
        {loading ? (
          <div className="p-3 sm:p-4">
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-200" />
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            {touched && query ? "No se encontraron usuarios para tu búsqueda." : "Escribe arriba y busca usuarios."}
          </div>
        ) : (
          <>
            <div className="border-b border-slate-200 px-4 py-2 text-sm text-slate-600">
              {results.length} resultado{results.length !== 1 ? "s" : ""}
            </div>
            <ul className="divide-y divide-slate-200">
              {results.map((u) => (
                <li key={u.id} className="px-4 py-3 hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {u.name || String(u.username)}
                      </div>
                      <div className="text-xs text-slate-500">
                        ID usuario: {u.username}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => goToDM(u.username)} // username = userId
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
                      >
                        Abrir chat
                      </button>
                      <Link
                        to={`/seeProfile/${u.username}`}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        Ver perfil
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
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

export default SearchUsers;
