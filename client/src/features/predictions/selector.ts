import type { RootState } from "../../app/store";

export const selectCryptos = (s: RootState) => s.predictions.cryptos;
export const selectLastSeries = (s: RootState) => s.predictions.last;
export const selectRegression = (s: RootState) => s.predictions.regression;
export const selectPredLoading = (s: RootState) => s.predictions.loading;
export const selectPredError = (s: RootState) => s.predictions.error;
export const selectSelected = (s: RootState) => s.predictions.selected;
