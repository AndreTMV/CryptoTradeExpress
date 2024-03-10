import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import perfilService from './perfilService';

interface PerfilState {
    perfil: any;
    perfilIsError: boolean;
    perfilIsSuccess: boolean;
    perfilIsLoading: boolean;
    perfilMessage: string;
}

const initialState: PerfilState = {
    perfil: {},
    perfilIsError: false,
    perfilIsSuccess: false,
    perfilIsLoading: false,
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
    }
})

export const { reset } = perfilSlice.actions

export default perfilSlice.reducer