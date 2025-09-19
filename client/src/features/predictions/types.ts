export type Timeframe =
  | "1m" | "3m" | "5m" | "15m" | "30m"
  | "1h" | "2h" | "4h" | "6h" | "8h" | "12h"
  | "1d" | "3d" | "1w" | "1M";

export interface SeriesPoint {
  t: string;      // ISO string UTC "YYYY-MM-DDTHH:mm:ssZ"
  close: number;
}

export interface CryptosResponse {
  cryptos: string[];
}

export interface LastSeriesResponse {
  symbol: string;       // p.ej. "BTC/USDT"
  timeframe: Timeframe; // p.ej. "1d"
  series: SeriesPoint[];
}

export interface RegressionResponse {
  symbol: string;
  timeframe: Timeframe;
  historical: {
    t: string[];
    close: number[];
  };
  regression: {
    model: "linear";
    horizon: number;
    future: { t: string[]; close: number[] };
    metrics: { rmse: number; r2: number };
    coefficients: { slope: number; intercept: number };
  };
}

export interface LastSeriesDTO {
  crypto: string;                  // "BTC" o "BTC/USDT"
  timeframe?: Timeframe;           // default "1d"
  limit?: number;                  // default 10
}

export interface RegressionDTO {
  crypto: string;
  timeframe?: Timeframe;           // default "1d"
  limit?: number;                  // default 500
  horizon?: number;                // default 500
}

export interface PredictionsState {
  cryptos: string[];
  last: LastSeriesResponse | null;
  regression: RegressionResponse | null;
  loading: boolean;
  error?: string;
  selected: {
    crypto?: string;
    timeframe?: Timeframe;
    horizon?: number;
    limit?: number;
  };
}
