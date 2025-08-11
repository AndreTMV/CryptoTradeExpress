export type HideKey =
  | "name"
  | "interested_cryptos"
  | "description"
  | "date_joined"
  | "friend_list"
  | "videos_calification"
  | "birth_day";

export interface IPerfil {
  id: number;
  username: number;
  name: string;
  interested_cryptos: string[];
  description: string;
  date_joined: string | null;
  birth_day: string | null;
  videos_calification: number | null;
  friend_list_count: number;
  hide_information: HideKey[];
}

export type PublicPerfil = Partial<{
  id: number;
  username: string;
  name: string;
  interested_cryptos: string[];
  description: string;
  date_joined: string | null;
  birth_day: string | null;
  friend_list: number;
  videos_calification: number | null;
}>;

export type Similarities = Record<
  number,
  { username: string; similarity: number }
>;

export interface CreatePerfilDTO {
  username: number;
  name: string;
  interested_cryptos: string[];
  description: string;
  birth_day?: string | null;
  hide_information?: HideKey[];
}

export interface UpdatePerfilDTO {
  perfilId: number;
  data: Partial<Omit<CreatePerfilDTO, "username">>;
}

export interface UpdateHiddenInformationDTO {
  username: number;
  hideInformation: HideKey[];
}

export interface CheckPerfilDTO {
  id: number;
}

export interface PerfilInfoDTO {
  id: number;
}

export interface PublicInfoDTO {
  id: number;
}

export interface RecommendationsDTO {
  user: number;
}

export interface ExcludeUserDTO {
  user: number;
  exclude: number;
}

export interface ExcludedUsersDTO {
  user: number;
}

export interface SetKeysDTO {
  user: number;
  apiKey: string;
  apiSecret: string;
}

export interface CheckKeysDTO {
  user: number;
}

export type SimpleStatus = { status: string } | string | boolean;
