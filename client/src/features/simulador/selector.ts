import { RootState } from "../../app/store";

export const selectSimulation = (s: RootState) => s.simulation.current;
export const selectPrices = (s: RootState) => s.simulation.prices;
export const selectTransactions = (s: RootState) => s.simulation.transactions;
export const selectPredictions = (s: RootState) => s.simulation.predictions;
export const selectSimLoading = (s: RootState) => s.simulation.loading;
export const selectSimError = (s: RootState) => s.simulation.error;
export const selectSimSuccess = (s: RootState) => s.simulation.success;
