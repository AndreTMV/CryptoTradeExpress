import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import perfilService from "./perfilService";
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

type Reject = string;

interface PerfilState {
  profile: IPerfil | null;
  profiles: IPerfil[];
  publicProfile: PublicPerfil | null;
  similarities: Similarities | null;
  excluded: number[];
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string | null;
  hideUpdated: boolean;
}

const initialState: PerfilState = {
  profile: null,
  profiles: [],
  publicProfile: null,
  similarities: null,
  excluded: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: null,
  hideUpdated: false,
};

export const createPerfil = createAsyncThunk<IPerfil, CreatePerfilDTO, { rejectValue: Reject }>(
  "perfil/createPerfil",
  async (payload, thunkAPI) => {
    try {
      return await perfilService.createPerfil(payload);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al crear perfil");
    }
  }
);

export const checkPerfil = createAsyncThunk<boolean, CheckPerfilDTO, { rejectValue: Reject }>(
  "perfil/checkPerfil",
  async (payload, thunkAPI) => {
    try {
      return await perfilService.checkPerfil(payload);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al verificar perfil");
    }
  }
);

export const perfilInfo = createAsyncThunk<IPerfil, PerfilInfoDTO, { rejectValue: Reject }>(
  "perfil/perfilInfo",
  async (payload, thunkAPI) => {
    try {
      return await perfilService.perfilInfo(payload);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al cargar perfil");
    }
  }
);

export const updatePerfil = createAsyncThunk<IPerfil, UpdatePerfilDTO, { rejectValue: Reject }>(
  "perfil/updatePerfil",
  async (payload, thunkAPI) => {
    try {
      return await perfilService.updatePerfil(payload);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al actualizar perfil");
    }
  }
);

export const updateHiddenInformation = createAsyncThunk<SimpleStatus, UpdateHiddenInformationDTO, { rejectValue: Reject }>(
  "perfil/updateHiddenInformation",
  async (payload, thunkAPI) => {
    try {
      return await perfilService.updateHiddenInformation(payload);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al actualizar privacidad");
    }
  }
);

export const getAllPerfils = createAsyncThunk<IPerfil[], void, { rejectValue: Reject }>(
  "perfil/getAllPerfils",
  async (_, thunkAPI) => {
    try {
      return await perfilService.getAllPerfils();
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al listar perfiles");
    }
  }
);

export const seePublicInfo = createAsyncThunk<PublicPerfil, PublicInfoDTO, { rejectValue: Reject }>(
  "perfil/seePublicInfo",
  async (payload, thunkAPI) => {
    try {
      return await perfilService.seePublicInfo(payload);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al cargar información pública");
    }
  }
);

export const fetchRecomendations = createAsyncThunk<Similarities, RecommendationsDTO, { rejectValue: Reject }>(
  "perfil/fetchRecomendations",
  async (payload, thunkAPI) => {
    try {
      return await perfilService.fetchRecomendations(payload);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al cargar recomendaciones");
    }
  }
);

export const excludeUser = createAsyncThunk<SimpleStatus, ExcludeUserDTO, { rejectValue: Reject }>(
  "perfil/excludeUser",
  async (payload, thunkAPI) => {
    try {
      return await perfilService.excludeUser(payload);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al excluir usuario");
    }
  }
);

export const fetchExcludedUsers = createAsyncThunk<number[], ExcludedUsersDTO, { rejectValue: Reject }>(
  "perfil/fetchExcludedUsers",
  async (payload, thunkAPI) => {
    try {
      return await perfilService.fetchExcludedUsers(payload);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al cargar lista de excluidos");
    }
  }
);

export const checkKeys = createAsyncThunk<SimpleStatus, CheckKeysDTO, { rejectValue: Reject }>(
  "perfil/checkKeys",
  async (payload, thunkAPI) => {
    try {
      return await perfilService.checkKeys(payload);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al verificar llaves");
    }
  }
);

export const setKeys = createAsyncThunk<SimpleStatus, SetKeysDTO, { rejectValue: Reject }>(
  "perfil/setKeys",
  async (payload, thunkAPI) => {
    try {
      return await perfilService.setKeys(payload);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message || "Error al guardar llaves");
    }
  }
);

const perfilSlice = createSlice({
  name: "perfil",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = null;
      state.hideUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPerfil.pending, (s) => { s.isLoading = true; })
      .addCase(createPerfil.fulfilled, (s, a: PayloadAction<IPerfil>) => {
        s.isLoading = false; s.isSuccess = true; s.profile = a.payload;
      })
      .addCase(createPerfil.rejected, (s, a) => {
        s.isLoading = false; s.isError = true; s.message = a.payload as string ?? "Error";
      })

      .addCase(checkPerfil.fulfilled, (s, a: PayloadAction<boolean>) => {
        s.message = String(a.payload);
      })

      .addCase(perfilInfo.pending, (s) => { s.isLoading = true; })
      .addCase(perfilInfo.fulfilled, (s, a: PayloadAction<IPerfil>) => {
        s.isLoading = false; s.profile = a.payload;
      })
      .addCase(perfilInfo.rejected, (s, a) => {
        s.isLoading = false; s.isError = true; s.message = a.payload as string ?? "Error";
      })

      .addCase(updatePerfil.pending, (s) => { s.isLoading = true; })
      .addCase(updatePerfil.fulfilled, (s, a: PayloadAction<IPerfil>) => {
        s.isLoading = false; s.isSuccess = true; s.profile = a.payload;
      })
      .addCase(updatePerfil.rejected, (s, a) => {
        s.isLoading = false; s.isError = true; s.isSuccess = false; s.message = a.payload as string ?? "Error";
      })

      .addCase(updateHiddenInformation.pending, (s) => { s.isLoading = true; })
      .addCase(updateHiddenInformation.fulfilled, (s, a: PayloadAction<SimpleStatus>) => {
        s.isLoading = false; s.hideUpdated = true;
        s.message = typeof a.payload === "string" ? a.payload : (a.payload as any)?.status ?? "ok";
      })
      .addCase(updateHiddenInformation.rejected, (s, a) => {
        s.isLoading = false; s.hideUpdated = false; s.message = a.payload as string ?? "Error";
      })

      .addCase(getAllPerfils.pending, (s) => { s.isLoading = true; })
      .addCase(getAllPerfils.fulfilled, (s, a: PayloadAction<IPerfil[]>) => {
        s.isLoading = false; s.profiles = a.payload;
      })
      .addCase(getAllPerfils.rejected, (s, a) => {
        s.isLoading = false; s.isError = true; s.message = a.payload as string ?? "Error";
      })

      .addCase(seePublicInfo.pending, (s) => { s.isLoading = true; })
      .addCase(seePublicInfo.fulfilled, (s, a: PayloadAction<PublicPerfil>) => {
        s.isLoading = false; s.publicProfile = a.payload;
      })
      .addCase(seePublicInfo.rejected, (s, a) => {
        s.isLoading = false; s.isError = true; s.message = a.payload as string ?? "Error";
      })

      .addCase(fetchRecomendations.pending, (s) => { s.isLoading = true; })
      .addCase(fetchRecomendations.fulfilled, (s, a: PayloadAction<Similarities>) => {
        s.isLoading = false; s.similarities = a.payload;
      })
      .addCase(fetchRecomendations.rejected, (s, a) => {
        s.isLoading = false; s.isError = true; s.message = a.payload as string ?? "Error";
      })

      .addCase(excludeUser.pending, (s) => { s.isLoading = true; })
      .addCase(excludeUser.fulfilled, (s, a: PayloadAction<SimpleStatus>) => {
        s.isLoading = false; s.isSuccess = true;
        s.message = typeof a.payload === "string" ? a.payload : (a.payload as any)?.status ?? "ok";
      })
      .addCase(excludeUser.rejected, (s, a) => {
        s.isLoading = false; s.isSuccess = false; s.isError = true; s.message = a.payload as string ?? "Error";
      })

      .addCase(fetchExcludedUsers.fulfilled, (s, a: PayloadAction<number[]>) => {
        s.excluded = a.payload;
      })

      .addCase(checkKeys.fulfilled, (s, a: PayloadAction<SimpleStatus>) => {
        s.message = typeof a.payload === "string" ? a.payload : (a.payload as any)?.status ?? String(a.payload);
      })

      .addCase(setKeys.pending, (s) => { s.isLoading = true; })
      .addCase(setKeys.fulfilled, (s, a: PayloadAction<SimpleStatus>) => {
        s.isLoading = false; s.isSuccess = true;
        s.message = typeof a.payload === "string" ? a.payload : (a.payload as any)?.status ?? "ok";
      })
      .addCase(setKeys.rejected, (s, a) => {
        s.isLoading = false; s.isSuccess = false; s.isError = true; s.message = a.payload as string ?? "Error";
      });
  },
});

export const { reset } = perfilSlice.actions;
export default perfilSlice.reducer;
