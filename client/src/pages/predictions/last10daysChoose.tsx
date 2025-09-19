import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { getCryptos, reset as resetPred, setSelected } from "../../features/predictions/predictionsSlice";
import { toast } from "react-hot-toast";

const DEFAULT_TIMEFRAME = "1d" as const;
const DEFAULT_LIMIT = 10 as const;

const ChooseCrypto10: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { cryptos, loading, error, selected } = useSelector((s: RootState) => s.predictions);
  const [query, setQuery] = React.useState("");
  const [crypto, setCrypto] = React.useState<string>(selected.crypto ?? "");

  React.useEffect(() => {
    void dispatch(getCryptos());
    return () => { dispatch(resetPred()); };
  }, [dispatch]);

  React.useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const list = React.useMemo(() => {
    const q = query.trim().toUpperCase();
    const arr = cryptos.slice().sort();
    return q ? arr.filter((c) => c.toUpperCase().includes(q)) : arr;
  }, [cryptos, query]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crypto) return toast.error("Selecciona una crypto primero");
    dispatch(setSelected({ crypto })); // recuerda última selección
    navigate("/graphLast10Days", { state: { crypto, timeframe: DEFAULT_TIMEFRAME, limit: DEFAULT_LIMIT } });
  };

  return (
    <div className="mx-auto grid min-h-screen place-items-center p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200"
      >
        <h1 className="mb-1 text-center text-2xl font-extrabold tracking-tight text-indigo-900">
          CryptoTradeExpress
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Elige una crypto para ver sus <b>últimos 10</b> cierres.
        </p>

        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="search">
          Buscar
        </label>
        <input
          id="search"
          type="text"
          placeholder="BTC, ETH, SOL…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-4 w-full rounded-lg border px-3 py-2 text-sm text-gray-500 shadow-sm outline-none ring-1 ring-transparent focus:ring-indigo-300"
          autoComplete="off"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="crypto">
          Crypto
        </label>
        <select
          id="crypto"
          value={crypto}
          onChange={(e) => setCrypto(e.target.value)}
          disabled={loading || !list.length}
          className="mb-2 w-full rounded-lg border px-3 py-2 text-sm text-gray-900 shadow-sm outline-none ring-1 ring-transparent focus:ring-indigo-300 disabled:opacity-60"
        >
          <option value="">{loading ? "Cargando…" : "Selecciona una crypto"}</option>
          {list.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="mb-4 text-right text-xs text-gray-500">
          {loading ? "Cargando listado…" : `${list.length} resultado(s)`}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="submit"
            disabled={!crypto || loading}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? "Procesando…" : "Ver precios"}
          </button>
          <Link
            to="/dashboard"
            className="grid place-items-center rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-600"
          >
            Regresar
          </Link>
        </div>

        {loading && (
          <div className="mt-6 space-y-2">
            <div className="h-3 animate-pulse rounded bg-slate-200" />
            <div className="h-3 animate-pulse rounded bg-slate-200" />
            <div className="h-3 animate-pulse rounded bg-slate-200" />
          </div>
        )}

        {!loading && cryptos.length === 0 && (
          <div className="mt-6 rounded-lg bg-amber-50 p-3 text-center text-sm text-amber-700 ring-1 ring-amber-200">
            No se pudo cargar el listado. Intenta nuevamente.
          </div>
        )}
      </form>
    </div>
  );
};

export default ChooseCrypto10;
