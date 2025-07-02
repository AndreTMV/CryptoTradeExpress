import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import perfilService from './perfilService';

interface PerfilState {
    excluded: any
    perfil: any;
    perfilIsError: boolean;
    perfilIsSuccess: boolean;
    perfilIsLoading: boolean;
    hideInfo: boolean;
    perfilMessage: string;
}

const initialState: PerfilState = {
    excluded: {},
    perfil: {},
    perfilIsError: false,
    perfilIsSuccess: false,
    perfilIsLoading: false,
    hideInfo: false,
    perfilMessage: '',
};

export const createPerfil = createAsyncThunk(
    "perfil/createPerfil",
    async (perfilData: any, thunkAPI) => {
        try {
            return await perfilService.createPerfil(perfilData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const checkPerfil = createAsyncThunk(
    "perfil/checkPerfil",
    async (perfilData: any, thunkAPI) => {
        try {
            return await perfilService.checkPerfil(perfilData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const perfilInfo = createAsyncThunk(
    "perfil/perfilInfo",
    async (perfilData: any, thunkAPI) => {
        try {
            return await perfilService.perfilInfo(perfilData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const updatePerfil = createAsyncThunk(
    "perfil/updatePerfil",
    async (perfilData: any, thunkAPI) => {
        try {
            return await perfilService.updatePerfil(perfilData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const updateHiddenInformation = createAsyncThunk(
    "perfil/updateHiddenInformation",
    async (perfilData: any, thunkAPI) => {
        try {
            return await perfilService.updateHiddenInformation(perfilData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getAllPerfils = createAsyncThunk(
    "perfil/getAllPerfils",
    async ( _, thunkAPI ) =>
    {
        try {
            return await perfilService.getAllPerfils()
        } catch ( error ) { 
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const seePublicInfo = createAsyncThunk(
    "perfil/seePublicInfo",
    async ( perfilData: any, thunkAPI ) =>
    {
        try {
            return await perfilService.seePublicInfo(perfilData)
        } catch (error) {
             const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)           
        }

    }
)

export const fetchRecomendations = createAsyncThunk(
    "perfil/fetchRecomendations",
    async ( perfilData: any, thunkAPI ) =>
    {
        try {
            return await perfilService.fetchRecomendations(perfilData)
        } catch (error) {
             const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)           
        }

    }
)

export const excludeUser = createAsyncThunk(
    "perfil/excludeUser",
    async ( perfilData: any, thunkAPI ) =>
    {
        try {
            return await perfilService.exlcudeUser(perfilData)
        } catch (error) {
             const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)           
        }

    }
)

export const fetchExcludedUsers = createAsyncThunk(
    "perfil/fetchExcludedUsers",
    async ( perfilData: any, thunkAPI ) =>
    {
        try {
            return await perfilService.fetchExcludedUsers(perfilData)
        } catch (error) {
             const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)           
        }
    }
)

export const checkKeys = createAsyncThunk(
    "perfil/checkKeys",
    async (perfilData: any, thunkAPI) => {
        try {
            return await perfilService.checkKeys(perfilData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const setKeys = createAsyncThunk(
    "perfil/setKeys",
    async (perfilData: any, thunkAPI) => {
        try {
            return await perfilService.setKeys(perfilData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const perfilSlice = createSlice({
    name: "perfil",
    initialState,
    reducers: {
        reset: (state) => {
            state.perfilIsLoading = false
            state.perfilIsError = false
            state.perfilIsSuccess = false
            state.perfilMessage = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase( createPerfil.pending, ( state ) =>
            {
                state.perfilIsLoading = true
            })
            .addCase( createPerfil.fulfilled, ( state ) =>
            {
                state.perfilIsSuccess = true,
                state.perfilIsLoading = false
            })
            .addCase( createPerfil.rejected, ( state, action) =>
            {
                state.perfilIsError = true,
                state.perfilIsLoading = false,
                state.perfilIsSuccess = false,
                state.perfilMessage = action.payload
            } )
            .addCase( checkPerfil.fulfilled, ( state, action ) =>
            {
                state.perfilMessage = action.payload
            })
            .addCase( perfilInfo.fulfilled, ( state, action ) =>
            {
                state.perfil = action.payload
            })
            .addCase( updatePerfil.pending, ( state ) =>
            {
                state.perfilIsLoading = true
            })
            .addCase( updatePerfil.fulfilled, ( state, action ) =>
            {
                state.perfilIsSuccess = true,
                state.perfilIsLoading = false
                state.perfil = action.payload
            })
            .addCase( updatePerfil.rejected, ( state, action) =>
            {
                state.perfilIsError = true,
                state.perfilIsLoading = false,
                state.perfilIsSuccess = false,
                state.perfilMessage = action.payload
            } )
            .addCase( updateHiddenInformation.pending, ( state ) =>
            {
                state.perfilIsLoading = true
            })
            .addCase( updateHiddenInformation.fulfilled, ( state, action ) =>
            {
                state.hideInfo = true
                state.perfilIsLoading = false
                state.perfil = action.payload
            })
            .addCase( updateHiddenInformation.rejected, ( state, action) =>
            {
                state.hideInfo = false
                state.perfilIsLoading = false,
                state.perfilMessage = action.payload
            } )
            .addCase( getAllPerfils.fulfilled, ( state, action ) =>
            {
                state.perfil = action.payload
            })
            .addCase( seePublicInfo.fulfilled, ( state, action ) =>
            {
                state.perfil = action.payload
            })
            .addCase( fetchRecomendations.fulfilled, ( state, action ) =>
            {
                state.perfil = action.payload
            })
            .addCase( excludeUser.pending, ( state ) =>
            {
                state.perfilIsLoading = true
            })
            .addCase( excludeUser.fulfilled, ( state, action ) =>
            {
                state.perfilIsSuccess = true
                state.perfilIsLoading = false
                state.perfil = action.payload
            })
            .addCase( excludeUser.rejected, ( state, action) =>
            {
                state.perfilIsSuccess = false
                state.perfilIsLoading = false,
                state.perfilIsError = true,
                state.perfilMessage = action.payload
            } )
            .addCase( fetchExcludedUsers.fulfilled, ( state, action ) =>
            {
                state.excluded = action.payload
            })
            .addCase( checkKeys.fulfilled, ( state, action ) =>
            {
                state.perfilMessage = action.payload
            })
            .addCase( setKeys.pending, ( state ) =>
            {
                state.perfilIsLoading = true
            })
            .addCase( setKeys.fulfilled, ( state, action ) =>
            {
                state.perfilIsSuccess = true
                state.perfilIsLoading = false
                state.perfil = action.payload
            })
            .addCase( setKeys.rejected, ( state, action) =>
            {
                state.perfilIsSuccess = false
                state.perfilIsLoading = false,
                state.perfilIsError = true,
                state.perfilMessage = action.payload
            } )
    }
})

export const { reset } = perfilSlice.actions

export default perfilSlice.reducer