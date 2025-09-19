import { createSlice, createAsyncThunk, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import predictionsService from "./predictionsService";
import type {
  PredictionsState, LastSeriesDTO, RegressionDTO,
  LastSeriesResponse, RegressionResponse,
} from "./types";
import { AxiosError } from "axios";

const initialState: PredictionsState = {
  cryptos: [],
  last: null,
  regression: null,
  loading: false,
  error: undefined,
  selected: {},
};

const getErr = (e: unknown) => {
  const ax = e as AxiosError<any>;
  return (ax?.response?.data?.error ?? ax?.response?.data?.message ?? ax?.message ?? "Error inesperado") as string;
};

export const getCryptos = createAsyncThunk<string[], void, { rejectValue: string }>(
  "predictions/getCryptos",
  async (_, { rejectWithValue }) => {
    try { return await predictionsService.getCryptos(); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

export const getLastSeries = createAsyncThunk<LastSeriesResponse, LastSeriesDTO, { rejectValue: string }>(
  "predictions/getLastSeries",
  async (payload, { rejectWithValue }) => {
    try { return await predictionsService.fetchLastSeries(payload); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

export const getRegression = createAsyncThunk<RegressionResponse, RegressionDTO, { rejectValue: string }>(
  "predictions/getRegression",
  async (payload, { rejectWithValue }) => {
    try { return await predictionsService.fetchRegression(payload); }
    catch (e) { return rejectWithValue(getErr(e)); }
  }
);

const predictionsSlice = createSlice({
  name: "predictions",
  initialState,
  reducers: {
    reset(state) {
      state.loading = false;
      state.error = undefined;
    },
    setSelected(state, action: PayloadAction<PredictionsState["selected"]>) {
      state.selected = { ...state.selected, ...action.payload };
    },
    clearData(state) {
      state.last = null;
      state.regression = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fulfilled
      .addCase(getCryptos.fulfilled, (s, a: PayloadAction<string[]>) => {
        s.cryptos = a.payload ?? [];
        s.loading = false; s.error = undefined;
      })
      .addCase(getLastSeries.fulfilled, (s, a: PayloadAction<LastSeriesResponse>) => {
        s.last = a.payload; s.loading = false; s.error = undefined;
        // sync selected según la última búsqueda
        s.selected.crypto = a.payload.symbol.split("/")[0];
        s.selected.timeframe = a.payload.timeframe;
        s.selected.limit = a.payload.series.length;
      })
      .addCase(getRegression.fulfilled, (s, a: PayloadAction<RegressionResponse>) => {
        s.regression = a.payload; s.loading = false; s.error = undefined;
        s.selected.crypto = a.payload.symbol.split("/")[0];
        s.selected.timeframe = a.payload.timeframe;
        s.selected.horizon = a.payload.regression.horizon;
      })
      // pending/rejected comunes
      .addMatcher(isAnyOf(getCryptos.pending, getLastSeries.pending, getRegression.pending), (s) => {
        s.loading = true; s.error = undefined;
      })
      .addMatcher(isAnyOf(getCryptos.rejected, getLastSeries.rejected, getRegression.rejected), (s, a) => {
        s.loading = false; s.error = (a.payload as string) ?? "Error inesperado";
      });
  },
});

export const { reset, setSelected, clearData } = predictionsSlice.actions;
export default predictionsSlice.reducer;
