import { createSlice, createAsyncThunk, type PayloadAction, isAnyOf } from "@reduxjs/toolkit";
import simuladorService from "./simuladorService";
import type {
  SimuladorState, Simulacion, PrecioBTC, Transaccion,
  ByUserDTO, BuySellDTO, UpdateDateDTO, MorePredictionsDTO
} from "./types";
import { AxiosError } from "axios";

const initialState: SimuladorState = {
  current: null,
  prices: [],
  transactions: [],
  predictions: [],
  loading: false,
  success: false,
  error: undefined,
};

const getErr = (e: unknown) => {
  const ax = e as AxiosError<any>;
  return (ax?.response?.data?.error ?? ax?.response?.data?.status ?? ax?.message ?? "Error inesperado") as string;
};

export const startSimulation = createAsyncThunk<Simulacion, ByUserDTO, { rejectValue: string }>(
  "sim/start",
  async (payload, { rejectWithValue }) => {
    try { return await simuladorService.iniciarSimulacion(payload); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

export const resetSimulation = createAsyncThunk<Simulacion, ByUserDTO, { rejectValue: string }>(
  "sim/reset",
  async (payload, { rejectWithValue }) => {
    try { return await simuladorService.reiniciarSimulacion(payload); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

export const fetchSimulation = createAsyncThunk<Simulacion, ByUserDTO, { rejectValue: string }>(
  "sim/fetch",
  async (payload, { rejectWithValue }) => {
    try { return await simuladorService.obtenerSimulacion(payload); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

export const getBitcoinPrices = createAsyncThunk<PrecioBTC[], ByUserDTO, { rejectValue: string }>(
  "sim/prices",
  async (payload, { rejectWithValue }) => {
    try { return await simuladorService.obtenerPreciosBitcoin(payload); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

export const getTransactions = createAsyncThunk<Transaccion[], ByUserDTO, { rejectValue: string }>(
  "sim/transactions",
  async (payload, { rejectWithValue }) => {
    try { return await simuladorService.obtenerTransacciones(payload); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

export const advanceSimulation = createAsyncThunk<Simulacion, ByUserDTO, { rejectValue: string }>(
  "sim/advance",
  async (payload, { rejectWithValue }) => {
    try { return await simuladorService.avanzarSimulacion(payload); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

export const buyBitcoin = createAsyncThunk<Simulacion, BuySellDTO, { rejectValue: string }>(
  "sim/buy",
  async (payload, { rejectWithValue }) => {
    try { return await simuladorService.comprarBitcoin(payload); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

export const sellBitcoin = createAsyncThunk<Simulacion, BuySellDTO, { rejectValue: string }>(
  "sim/sell",
  async (payload, { rejectWithValue }) => {
    try { return await simuladorService.venderBitcoin(payload); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

export const getPredictions = createAsyncThunk<number[], void, { rejectValue: string }>(
  "sim/predictions",
  async (_, { rejectWithValue }) => {
    try { return await simuladorService.predecirPrecios(); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

export const updateDate = createAsyncThunk<Simulacion, UpdateDateDTO, { rejectValue: string }>(
  "sim/updateDate",
  async (payload, { rejectWithValue }) => {
    try { return await simuladorService.updateDate(payload); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

export const morePredictions = createAsyncThunk<Simulacion, MorePredictionsDTO, { rejectValue: string }>(
  "sim/morePredictions",
  async (payload, { rejectWithValue }) => {
    try { return await simuladorService.morePredictions(payload); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

const simulacionSlice = createSlice({
  name: "simulation",
  initialState,
  reducers: {
    reset(state) {
      state.loading = false;
      state.success = false;
      state.error = undefined;
    },
    clearPredictions(state) {
      state.predictions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startSimulation.fulfilled, (s, a: PayloadAction<Simulacion>) => {
        s.current = a.payload; s.success = true; s.loading = false;
      })
      .addCase(resetSimulation.fulfilled, (s, a: PayloadAction<Simulacion>) => {
        s.current = a.payload; s.success = true; s.loading = false;
        s.prices = []; s.transactions = []; s.predictions = [];
      })
      .addCase(fetchSimulation.fulfilled, (s, a: PayloadAction<Simulacion>) => {
        s.current = a.payload; s.success = true; s.loading = false;
      })
      .addCase(advanceSimulation.fulfilled, (s, a: PayloadAction<Simulacion>) => {
        s.current = a.payload; s.success = true; s.loading = false;
      })
      .addCase(buyBitcoin.fulfilled, (s, a: PayloadAction<Simulacion>) => {
        s.current = a.payload; s.success = true; s.loading = false;
      })
      .addCase(sellBitcoin.fulfilled, (s, a: PayloadAction<Simulacion>) => {
        s.current = a.payload; s.success = true; s.loading = false;
      })
      .addCase(updateDate.fulfilled, (s, a: PayloadAction<Simulacion>) => {
        s.current = a.payload; s.success = true; s.loading = false;
      })
      .addCase(morePredictions.fulfilled, (s, a: PayloadAction<Simulacion>) => {
        s.current = a.payload; s.success = true; s.loading = false;
      });

    builder.addCase(getBitcoinPrices.fulfilled, (s, a: PayloadAction<PrecioBTC[]>) => {
      s.prices = (a.payload ?? []).slice().sort((A, B) => new Date(A.fecha).getTime() - new Date(B.fecha).getTime());
      s.success = true; s.loading = false;
    });

    builder.addCase(getTransactions.fulfilled, (s, a: PayloadAction<Transaccion[]>) => {
      s.transactions = (a.payload ?? []).slice().sort((A, B) => new Date(A.fecha).getTime() - new Date(B.fecha).getTime());
      s.success = true; s.loading = false;
    });

    builder.addCase(getPredictions.fulfilled, (s, a: PayloadAction<number[]>) => {
      s.predictions = a.payload ?? []; s.success = true; s.loading = false;
    });

    builder.addMatcher(
      isAnyOf(
        startSimulation.pending, resetSimulation.pending, fetchSimulation.pending, getBitcoinPrices.pending,
        getTransactions.pending, advanceSimulation.pending, buyBitcoin.pending, sellBitcoin.pending,
        getPredictions.pending, updateDate.pending, morePredictions.pending
      ),
      (s) => { s.loading = true; s.success = false; s.error = undefined; }
    );
    builder.addMatcher(
      isAnyOf(
        startSimulation.rejected, resetSimulation.rejected, fetchSimulation.rejected, getBitcoinPrices.rejected,
        getTransactions.rejected, advanceSimulation.rejected, buyBitcoin.rejected, sellBitcoin.rejected,
        getPredictions.rejected, updateDate.rejected, morePredictions.rejected
      ),
      (s, a) => { s.loading = false; s.success = false; s.error = (a.payload as string) ?? "Error inesperado"; }
    );
  },
});

export const { reset, clearPredictions } = simulacionSlice.actions;
export default simulacionSlice.reducer;
