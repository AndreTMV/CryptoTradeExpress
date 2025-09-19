import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import {
  startSimulation,
  fetchSimulation,
  resetSimulation,
  getBitcoinPrices,
  buyBitcoin,
  sellBitcoin,
  advanceSimulation,
  updateDate,
  morePredictions,
  reset as resetFlags,
} from "../../features/simulador/simuladorSlice";
import { toast } from "react-hot-toast";

// Chart.js
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Tooltip, Legend, Filler,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

// ==== Helpers ====
const toMoney = (n: number | string | null | undefined) =>
  (n == null ? 0 : Number(n)).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const toBTC = (n: number | string | null | undefined) =>
  (n == null ? 0 : Number(n)).toLocaleString(undefined, { maximumFractionDigits: 8 });

const WINDOW = 30;                // Días a mostrar en el gráfico
const TICK_MS = 2500;             // Autoplay step

export default function SimulatorDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((s: RootState) => s.auth.userInfo);
  const userId = user?.id;

  // slice (según refactor propuesto)
  const current = useSelector((s: RootState) => s.simulation.current);
  const prices = useSelector((s: RootState) => s.simulation.prices);
  const loading = useSelector((s: RootState) => s.simulation.loading);
  const error = useSelector((s: RootState) => s.simulation.error);

  // Estado local UI
  const [cursor, setCursor] = useState<number>(0);     // índice del día actual dentro de `prices`
  const [amount, setAmount] = useState<string>("");    // cantidad BTC a comprar/vender (string para input controlado)
  const [autoplay, setAutoplay] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const actingRef = useRef<boolean>(false);            // evita solapes de acciones async

  // ====== Bootstrap ======
  useEffect(() => {
    if (!userId) return;
    // Intentar cargar simulación existente, si no hay -> botón para iniciar
    dispatch(fetchSimulation({ user: userId }))
      .unwrap()
      .then(() => dispatch(getBitcoinPrices({ user: userId })))
      .catch(() => {
        // No toast, es normal si no existe simulación aún
      });
  }, [dispatch, userId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetFlags());
    }
  }, [error, dispatch]);

  // ====== Cursor & ventana del gráfico ======
  // Coloca el cursor en la fecha de la simulación si existe; si no, en el último precio
  useEffect(() => {
    if (!prices.length) return;
    if (current?.fecha) {
      const idx = prices.findIndex(p => p.fecha === current.fecha);
      setCursor(idx >= 0 ? idx : prices.length - 1);
    } else {
      setCursor(prices.length - 1);
    }
  }, [prices, current?.fecha]);

  const windowed = useMemo(() => {
    if (!prices.length) return [];
    const start = Math.max(0, cursor - WINDOW);
    return prices.slice(start, cursor + 1);
  }, [prices, cursor]);

  const currentPrice = useMemo(() => {
    if (!prices.length || cursor < 0 || cursor >= prices.length) return null;
    return Number(prices[cursor].precio);
  }, [prices, cursor]);

  // ====== Autoplay ======
  useEffect(() => {
    if (!autoplay || !prices.length) {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      return;
    }
    timerRef.current = setInterval(async () => {
      if (actingRef.current) return;
      // Si hay siguiente día en buffer, avanza
      if (cursor < prices.length - 1) {
        setCursor(c => Math.min(c + 1, prices.length - 1));
        return;
      }
      // Si estamos al final, pedir más predicciones y refrescar precios
      try {
        actingRef.current = true;
        const lastDate = prices[prices.length - 1].fecha;
        await dispatch(morePredictions({ user: userId!, fecha: lastDate })).unwrap();
        await dispatch(getBitcoinPrices({ user: userId! })).unwrap();
        // mover cursor al nuevo último
        setCursor(prices.length - 1);
      } catch (e: any) {
        toast.error(e?.message || "No se pudo cargar más datos");
        setAutoplay(false);
      } finally {
        actingRef.current = false;
      }
    }, TICK_MS);

    return () => {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    };
  }, [autoplay, prices.length, cursor, dispatch, userId, prices]);

  // ====== Acciones ======
  const onStart = useCallback(async () => {
    if (!userId) return;
    try {
      await dispatch(startSimulation({ user: userId })).unwrap();
      await dispatch(getBitcoinPrices({ user: userId })).unwrap();
      toast.success("Simulación iniciada");
    } catch (e: any) {
      toast.error(e?.message || "No se pudo iniciar la simulación");
    }
  }, [dispatch, userId]);

  const onReset = useCallback(async () => {
    if (!userId) return;
    try {
      setAutoplay(false);
      await dispatch(resetSimulation({ user: userId })).unwrap();
      await dispatch(getBitcoinPrices({ user: userId })).unwrap();
      setAmount("");
      toast.success("Simulación reiniciada");
    } catch (e: any) {
      toast.error(e?.message || "No se pudo reiniciar");
    }
  }, [dispatch, userId]);

  const onAdvance31 = useCallback(async () => {
    if (!userId) return;
    try {
      setAutoplay(false);
      await dispatch(advanceSimulation({ user: userId })).unwrap();
      await dispatch(getBitcoinPrices({ user: userId })).unwrap();
      toast.success("Simulación avanzó 31 días");
    } catch (e: any) {
      toast.error(e?.message || "No se pudo avanzar");
    }
  }, [dispatch, userId]);

  const onBuy = useCallback(async () => {
    if (!userId || !currentPrice || !prices.length) return;
    const qty = Number(amount);
    if (!qty || qty <= 0) return toast.error("Ingresa una cantidad válida");
    const lastDate = prices[cursor].fecha;
    const cost = qty * currentPrice;
    if (Number(current?.balance ?? 0) < cost) {
      return toast.error("Balance insuficiente");
    }
    try {
      await dispatch(buyBitcoin({ user: userId, cantidad: qty, fecha: lastDate })).unwrap();
      toast.success("Compra realizada");
      await dispatch(fetchSimulation({ user: userId })).unwrap();
    } catch (e: any) {
      toast.error(e?.message || "No se pudo comprar");
    }
  }, [dispatch, userId, amount, currentPrice, prices, cursor, current?.balance]);

  const onSell = useCallback(async () => {
    if (!userId || !currentPrice || !prices.length) return;
    const qty = Number(amount);
    if (!qty || qty <= 0) return toast.error("Ingresa una cantidad válida");
    if (Number(current?.bitcoins ?? 0) < qty) {
      return toast.error("BTC insuficientes");
    }
    const lastDate = prices[cursor].fecha;
    try {
      await dispatch(sellBitcoin({ user: userId, cantidad: qty, fecha: lastDate })).unwrap();
      toast.success("Venta realizada");
      await dispatch(fetchSimulation({ user: userId })).unwrap();
    } catch (e: any) {
      toast.error(e?.message || "No se pudo vender");
    }
  }, [dispatch, userId, amount, currentPrice, prices, cursor, current?.bitcoins]);

  const onSaveAndBack = useCallback(async () => {
    if (!userId || !prices.length) return navigate("/dashboard");
    try {
      const lastDate = prices[cursor].fecha;
      await dispatch(updateDate({ user: userId, fecha: lastDate })).unwrap();
    } catch {
      /* opcionalmente mostrar toast, pero no bloquear navegación */
    } finally {
      navigate("/dashboard");
    }
  }, [dispatch, userId, prices, cursor, navigate]);

  // ====== Chart data ======
  const chartData = useMemo(() => ({
    labels: windowed.map(p => p.fecha),
    datasets: [
      {
        label: "BTC/USDT",
        data: windowed.map(p => Number(p.precio)),
        borderWidth: 2,
        borderColor: "rgba(79,70,229,1)",       // indigo-600
        backgroundColor: "rgba(79,70,229,0.15)",
        pointRadius: 0,
        fill: true,
        tension: 0.25,
      },
    ],
  }), [windowed]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        ticks: { callback: (v: any) => `$${Number(v).toLocaleString()}` },
        grid: { color: "rgba(0,0,0,0.06)" },
      },
    },
  }), []);

  // ====== UI ======
  const hasSimulation = Boolean(current?.id);
  const canTrade = hasSimulation && prices.length > 0 && currentPrice != null;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Simulador</h1>
          <p className="text-sm text-gray-500">Compra/Vende BTC con datos reales y pasos simulados.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white shadow hover:bg-slate-600"
          >
            Volver
          </Link>
        </div>
      </header>

      {/* Resumen */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          <div className="text-xs text-gray-500">Saldo</div>
          <div className="text-lg font-semibold text-gray-600">{toMoney(current?.balance)}</div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          <div className="text-xs text-gray-500">BTC</div>
          <div className="text-lg font-semibold text-gray-600">{toBTC(current?.bitcoins)} BTC</div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          <div className="text-xs text-gray-500">Fecha de simulación</div>
          <div className="text-lg font-semibold text-gray-600">{current?.fecha ?? "—"}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Gráfico */}
        <section className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5 lg:col-span-2">
          <div className="mb-3 flex items-end justify-between">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Precio actual</div>
              <div className="text-2xl font-bold text-gray-600">
                {currentPrice != null ? toMoney(currentPrice) : "—"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`rounded-lg px-3 py-2 text-sm  font-medium text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 ${autoplay ? "bg-indigo-50" : "hover:bg-gray-50"}`}
                onClick={() => setAutoplay((v) => !v)}
                disabled={!hasSimulation || loading}
              >
                {autoplay ? "Pausar" : "Reproducir"}
              </button>
              <button
                className="rounded-lg  px-3 py-2 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => setCursor((c) => Math.min(c + 1, prices.length - 1))}
                disabled={!hasSimulation || loading || cursor >= prices.length - 1}
              >
                Paso +1 día
              </button>
            </div>
          </div>

          <div className="h-[340px]">
            {prices.length ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="grid h-full place-items-center text-sm text-gray-500">
                {loading ? "Cargando datos..." : "No hay datos aún"}
              </div>
            )}
          </div>
        </section>

        {/* Controles */}
        <section className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          <h2 className="mb-4 text-lg font-semibold">Acciones</h2>

          {!hasSimulation ? (
            <button
              onClick={onStart}
              disabled={loading || !userId}
              className="mb-4 w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? "Iniciando..." : "Iniciar simulación"}
            </button>
          ) : (
            <>
              <div className="mb-3 grid grid-cols-2 gap-2">
                <button
                  onClick={onAdvance31}
                  disabled={loading}
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                  Avanzar 31 días
                </button>
                <button
                  onClick={onReset}
                  disabled={loading}
                  className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-60"
                >
                  Reiniciar
                </button>
              </div>

              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700">Cantidad (BTC)</label>
                <input
                  type="number"
                  min={0}
                  step="0.00000001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00000000"
                  className="w-full rounded-lg  border px-3 py-2 text-sm text-gray-600 shadow-sm outline-none ring-1 ring-transparent focus:ring-indigo-300"
                />
                <div className="mt-1 text-xs text-gray-500">
                  {currentPrice != null && Number(amount) > 0
                    ? <>Costo aprox: <b>{toMoney(Number(amount) * currentPrice)}</b></>
                    : "Ingresa una cantidad para calcular el costo"}
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2">
                <button
                  onClick={onBuy}
                  disabled={!canTrade || loading || !Number(amount)}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
                >
                  Comprar
                </button>
                <button
                  onClick={onSell}
                  disabled={!canTrade || loading || !Number(amount)}
                  className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-60"
                >
                  Vender
                </button>
              </div>

              <button
                onClick={onSaveAndBack}
                className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-600"
              >
                Guardar fecha y volver
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
