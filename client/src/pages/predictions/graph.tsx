import React from "react";
import Plot from "react-plotly.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { getRegression, reset as resetPred, setSelected } from "../../features/predictions/predictionsSlice";
import type { Timeframe } from "../../features/predictions/types";
import { toast } from "react-hot-toast";

const TIMEFRAMES: Timeframe[] = [
  "1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M"
];

const DEFAULT_TIMEFRAME: Timeframe = "1d";
const DEFAULT_HORIZON = 120;
const DEFAULT_LIMIT = 500;

const GraphPrediction: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { crypto?: string; timeframe?: Timeframe } };

  const cryptoParam = location.state?.crypto;
  const tfParam = location.state?.timeframe as Timeframe | undefined;

  const { regression: reg, loading, error, selected } = useSelector((s: RootState) => s.predictions);
  const [crypto, setCrypto] = React.useState<string>(cryptoParam ?? selected.crypto ?? "");
  const [timeframe, setTimeframe] = React.useState<Timeframe>(tfParam ?? selected.timeframe ?? DEFAULT_TIMEFRAME);
  const [horizon, setHorizon] = React.useState<number>(selected.horizon ?? DEFAULT_HORIZON);

  const fetchData = React.useCallback(async () => {
    if (!crypto) {
      toast.error("No se especificó la crypto");
      return navigate("/chooseCrypto");
    }
    try {
      dispatch(setSelected({ crypto, timeframe, horizon }));
      await dispatch(getRegression({ crypto, timeframe, limit: DEFAULT_LIMIT, horizon })).unwrap();
    } catch (e: any) {
      toast.error(e?.message ?? "No se pudo obtener la predicción");
    }
  }, [crypto, timeframe, horizon, dispatch, navigate]);

  React.useEffect(() => {
    void fetchData();
    return () => { dispatch(resetPred()); };
  }, [fetchData, dispatch]);

  React.useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const plotData = React.useMemo(() => {
    if (!reg) return null;
    const histX = reg.historical.t;
    const histY = reg.historical.close;
    const futX = reg.regression.future.t;
    const futY = reg.regression.future.close;

    return [
      {
        x: histX,
        y: histY,
        type: "scatter",
        mode: "lines",
        name: "Histórico (close)",
        line: { width: 2, color: "rgba(79,70,229,1)" },
        fill: "tozeroy",
        fillcolor: "rgba(79,70,229,0.12)",
      },
      {
        x: [histX[histX.length - 1], futX[0]],
        y: [histY[histY.length - 1], futY[0]],
        type: "scatter",
        mode: "lines",
        name: "Continuidad",
        line: { width: 1, dash: "dot", color: "rgba(107,114,128,0.7)" }, // gray-500
        hoverinfo: "skip",
        showlegend: false,
      },
      {
        x: futX,
        y: futY,
        type: "scatter",
        mode: "lines",
        name: `Predicción ${reg.regression.horizon} pasos`,
        line: { width: 2, dash: "dash", color: "rgba(16,185,129,1)" }, // emerald-500
      },
    ];
  }, [reg]);

  const layout = React.useMemo(
    () => ({
      title: reg ? `${reg.symbol} • ${reg.timeframe}` : "Predicción",
      margin: { l: 48, r: 16, t: 48, b: 40 },
      paper_bgcolor: "white",
      plot_bgcolor: "white",
      xaxis: { title: "Tiempo", showgrid: false },
      yaxis: { title: "Precio (USD)", gridcolor: "rgba(0,0,0,0.06)" },
      legend: { orientation: "h", x: 0, y: 1.12 },
      autosize: true,
    }),
    [reg]
  );

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-700">Predicción</h1>
          <p className="text-sm text-gray-500">Serie histórica + proyección lineal simple.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/chooseCrypto"
            className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white shadow hover:bg-slate-600"
          >
            Regresar
          </Link>
        </div>
      </header>

      <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          <label className="mb-1 block text-sm font-medium text-gray-700">Crypto</label>
          <input
            value={crypto}
            onChange={(e) => setCrypto(e.target.value.toUpperCase())}
            placeholder="BTC"
            className="w-full rounded-lg border px-3 py-2 text-sm text-gray-500 shadow-sm outline-none ring-1 ring-transparent focus:ring-indigo-300"
          />
          <p className="mt-1 text-xs text-gray-500">Ejemplo: BTC, ETH, SOL…</p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          <label className="mb-1 block text-sm font-medium text-gray-700">Timeframe</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as Timeframe)}
            className="w-full rounded-lg border px-3 py-2 text-sm text-gray-500 shadow-sm outline-none ring-1 ring-transparent focus:ring-indigo-300"
          >
            {TIMEFRAMES.map((tf) => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">Intervalo de velas.</p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          <label className="mb-1 block text-sm font-medium text-gray-700">Horizonte</label>
          <input
            type="number"
            min={1}
            max={2000}
            value={horizon}
            onChange={(e) => setHorizon(Number(e.target.value))}
            className="w-full rounded-lg border px-3 py-2 text-sm text-gray-500 shadow-sm outline-none ring-1 ring-transparent focus:ring-indigo-300"
          />
          <p className="mt-1 text-xs text-gray-500">Puntos a proyectar.</p>
        </div>
      </section>

      {/* Botones */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={fetchData}
          disabled={loading || !crypto}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? "Recalculando..." : "Recalcular"}
        </button>
        <Link
          to="/chooseCrypto"
          className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600"
        >
          Elegir otra crypto
        </Link>
      </div>

      {/* Métricas */}
      {reg && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
            <div className="text-xs text-gray-500">Símbolo</div>
            <div className="text-lg font-semibold text-gray-400">{reg.symbol}</div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
            <div className="text-xs text-gray-500">RMSE (fit)</div>
            <div className="text-lg font-semibold text-gray-400">{reg.regression.metrics.rmse.toFixed(2)}</div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
            <div className="text-xs text-gray-500">R² (fit)</div>
            <div className="text-lg font-semibold text-gray-400">{reg.regression.metrics.r2.toFixed(4)}</div>
          </div>
        </div>
      )}

      {/* Chart */}
      <section className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
        <div className="h-[420px]">
          {loading ? (
            <div className="space-y-2">
              <div className="h-3 animate-pulse rounded bg-slate-200" />
              <div className="h-3 animate-pulse rounded bg-slate-200" />
              <div className="h-3 animate-pulse rounded bg-slate-200" />
              <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-100" />
            </div>
          ) : reg && plotData ? (
            <Plot
              data={plotData as any}
              layout={layout as any}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
              config={{ displayModeBar: false, responsive: true }}
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-gray-500">
              {error ? "No se pudo cargar la predicción" : "Sin datos"}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GraphPrediction;
