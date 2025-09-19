import api from "../../api/axiosInstance";
import type {
  ByUserDTO, BuySellDTO, UpdateDateDTO, MorePredictionsDTO,
  Simulacion, PrecioBTC, Transaccion
} from "./types";

const ROOT = "/simulador/api/v1";

export const obtenerSimulacion = async (params: ByUserDTO): Promise<Simulacion> => {
  const { data } = await api.get<Simulacion>(`${ROOT}/simulacion/`, { params });
  return data;
};

export const obtenerTransacciones = async (params: ByUserDTO): Promise<Transaccion[]> => {
  const { data } = await api.get<Transaccion[]>(`${ROOT}/transacciones/`, { params });
  return Array.isArray(data) ? data : [];
};

export const obtenerPreciosBitcoin = async (params: ByUserDTO): Promise<PrecioBTC[]> => {
  const { data } = await api.get<PrecioBTC[]>(`${ROOT}/precios/`, { params });
  return Array.isArray(data) ? data : [];
};

export const iniciarSimulacion = async (body: ByUserDTO): Promise<Simulacion> => {
  const { data } = await api.post<Simulacion>(`${ROOT}/iniciar/`, body);
  return data;
};

export const reiniciarSimulacion = async (body: ByUserDTO): Promise<Simulacion> => {
  const { data } = await api.post<Simulacion>(`${ROOT}/reiniciar/`, body);
  return data;
};

export const avanzarSimulacion = async (body: ByUserDTO): Promise<Simulacion> => {
  const { data } = await api.post<Simulacion>(`${ROOT}/avanzar/`, body);
  return data;
};

export const comprarBitcoin = async (body: BuySellDTO): Promise<Simulacion> => {
  const { data } = await api.post<Simulacion>(`${ROOT}/comprar/`, body);
  return data;
};

export const venderBitcoin = async (body: BuySellDTO): Promise<Simulacion> => {
  const { data } = await api.post<Simulacion>(`${ROOT}/vender/`, body);
  return data;
};

export const predecirPrecios = async (): Promise<number[]> => {
  const { data } = await api.get<number[]>(`${ROOT}/predicciones/`);
  return Array.isArray(data) ? data : [];
};

export const updateDate = async (body: UpdateDateDTO): Promise<Simulacion> => {
  const { data } = await api.put<Simulacion>(`${ROOT}/actualizar_fecha/`, body);
  return data;
};

export const morePredictions = async (body: MorePredictionsDTO): Promise<Simulacion> => {
  const { data } = await api.post<Simulacion>(`${ROOT}/more_predictions/`, body);
  return data;
};

const simuladorService = {
  obtenerSimulacion,
  obtenerTransacciones,
  obtenerPreciosBitcoin,
  iniciarSimulacion,
  reiniciarSimulacion,
  avanzarSimulacion,
  comprarBitcoin,
  venderBitcoin,
  predecirPrecios,
  updateDate,
  morePredictions,
};
export default simuladorService;
