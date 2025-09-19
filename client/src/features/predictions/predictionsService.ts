import api from "../../api/axiosInstance";
import type {
  CryptosResponse, LastSeriesResponse, RegressionResponse,
  LastSeriesDTO, RegressionDTO, Timeframe,
} from "./types";

const ROOT = "/predictions/api/v1";

export const getCryptos = async (): Promise<string[]> => {
  const { data } = await api.get<CryptosResponse>(`${ROOT}/cryptos`);
  return data.cryptos ?? [];
};

export const fetchLastSeries = async ({
  crypto,
  timeframe = "1d",
  limit = 10,
}: LastSeriesDTO): Promise<LastSeriesResponse> => {
  const { data } = await api.get<LastSeriesResponse>(`${ROOT}/series/last`, {
    params: { crypto, timeframe, limit },
  });
  return data;
};

export const fetchRegression = async ({
  crypto,
  timeframe = "1d",
  limit = 500,
  horizon = 500,
}: RegressionDTO): Promise<RegressionResponse> => {
  const { data } = await api.get<RegressionResponse>(`${ROOT}/series/regression`, {
    params: { crypto, timeframe, limit, horizon },
  });
  return data;
};

const predictionsService = { getCryptos, fetchLastSeries, fetchRegression };
export default predictionsService;
