import api from "../../api/axiosInstance";
import type {
  IPerfil,
  PublicPerfil,
  Similarities,
  CreatePerfilDTO,
  UpdatePerfilDTO,
  UpdateHiddenInformationDTO,
  CheckPerfilDTO,
  PerfilInfoDTO,
  PublicInfoDTO,
  RecommendationsDTO,
  ExcludeUserDTO,
  ExcludedUsersDTO,
  SetKeysDTO,
  CheckKeysDTO,
  SimpleStatus,
} from "./types";

const PERFIL = "/perfil/api/v1/perfil/";
const PERFIL_EXISTS = "/perfil/api/v1/perfilExist/";
const PERFIL_INFO = "/perfil/api/v1/perfilInfo/";
const HIDE_INFORMATION = "/perfil/api/v1/hideInformation/";
const PUBLIC_INFORMATION = "/perfil/api/v1/publicInformation/";
const RECOMMENDATIONS = "/perfil/api/v1/cosineSimilarity/";
const EXCLUDE_USER = "/perfil/api/v1/excludeUser/";
const EXCLUDE_USER_LIST = "/perfil/api/v1/excludeUserList/";

const SET_KEYS = "/api/v1/auth/setKeys/";
const CHECK_KEYS = "/api/v1/auth/checkKeys/";

const createPerfil = async (perfil: CreatePerfilDTO): Promise<IPerfil> => {
  const { data } = await api.post(PERFIL, perfil);
  return data;
};

const checkPerfil = async ({ id }: CheckPerfilDTO): Promise<boolean> => {
  const { data } = await api.get<boolean>(PERFIL_EXISTS, { params: { id } });
  return data;
};

const perfilInfo = async ({ id }: PerfilInfoDTO): Promise<IPerfil> => {
  const { data } = await api.get<IPerfil>(PERFIL_INFO, { params: { id } });
  return data;
};

//const updatePerfil = async ({ perfilId, data: body }: UpdatePerfilDTO): Promise<IPerfil> => {
//  const { data } = await api.put<IPerfil>(`${PERFIL}${perfilId}/`, body);
//  return data;
//};
const updatePerfil = async (perfilData: {
  perfilId: number;
  username?: number;
  name?: string;
  description?: string;
  interested_cryptos?: string[];
  birth_day?: string;
}) => {
  const { perfilId, ...body } = perfilData;
  const { data } = await api.patch(`/perfil/api/v1/perfil/${perfilId}/`, body);
  return data;
};

const updateHiddenInformation = async ({
  username,
  hideInformation,
}: UpdateHiddenInformationDTO): Promise<SimpleStatus> => {
  // backend espera query param hide_information separada por comas
  const hide_information = hideInformation.join(",");
  const { data } = await api.put<SimpleStatus>(HIDE_INFORMATION, null, {
    params: { id: username, hide_information },
  });
  return data;
};

const getAllPerfils = async (): Promise<IPerfil[]> => {
  const { data } = await api.get<IPerfil[]>(PERFIL);
  return data;
};

const seePublicInfo = async ({ id }: PublicInfoDTO): Promise<PublicPerfil> => {
  const { data } = await api.get<PublicPerfil>(PUBLIC_INFORMATION, { params: { id } });
  return data;
};

const fetchRecomendations = async ({ user }: RecommendationsDTO): Promise<Similarities> => {
  const { data } = await api.get<Similarities>(RECOMMENDATIONS, { params: { user } });
  return data;
};

const excludeUser = async (payload: ExcludeUserDTO): Promise<SimpleStatus> => {
  const { data } = await api.put<SimpleStatus>(EXCLUDE_USER, payload);
  return data;
};

const fetchExcludedUsers = async ({ user }: ExcludedUsersDTO): Promise<number[]> => {
  const { data } = await api.get<number[]>(EXCLUDE_USER_LIST, { params: { user } });
  return data;
};

// ==== Auth (debería vivir en features/auth) ====
const setKeys = async (payload: SetKeysDTO): Promise<SimpleStatus> => {
  const { data } = await api.post<SimpleStatus>(SET_KEYS, payload);
  return data;
};

const checkKeys = async ({ user }: CheckKeysDTO): Promise<SimpleStatus> => {
  const { data } = await api.get<SimpleStatus>(CHECK_KEYS, { params: { user } });
  return data;
};

const perfilService = {
  createPerfil,
  checkPerfil,
  perfilInfo,
  updatePerfil,
  updateHiddenInformation,
  getAllPerfils,
  seePublicInfo,
  fetchRecomendations,
  excludeUser,
  fetchExcludedUsers,
  setKeys,
  checkKeys,
};

export default perfilService;
