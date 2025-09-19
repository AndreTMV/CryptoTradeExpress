export type IsoDate = string;      // 'YYYY-MM-DD'
export type IsoDateTime = string;  // ISO 8601

export interface Simulacion {
  id: number;
  user: number;
  balance: string;
  bitcoins: string;
  fecha: IsoDate;
}

export interface PrecioBTC {
  id: number;
  simulacion: number;
  fecha: IsoDate;
  precio: string;
}

export type TxType = "compra" | "venta";

export interface Transaccion {
  id: number;
  simulacion: number;
  tipo: TxType;
  cantidad: string;
  precio: string;
  fecha: IsoDateTime;
}

export interface ByUserDTO { user: number; }

export interface BuySellDTO {
  user: number;
  cantidad: number | string;
  fecha: IsoDate;
}

export interface UpdateDateDTO {
  user: number;
  fecha: IsoDate;
}

export interface MorePredictionsDTO {
  user: number;
  fecha: IsoDate;
}

export interface SimuladorState {
  current: Simulacion | null;
  prices: PrecioBTC[];
  transactions: Transaccion[];
  predictions: number[];
  loading: boolean;
  success: boolean;
  error?: string;
}
