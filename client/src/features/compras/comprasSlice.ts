import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import comprasService from './comprasService';

interface ComprasState {
    compras: any;
    comprasIsError: boolean;
    comprasIsSuccess: boolean;
    comprasIsLoading: boolean;
    comprasMessage: string;
}

const initialState: ComprasState = {
    compras: {},
    comprasIsError: false,
    comprasIsSuccess: false,
    comprasIsLoading: false,
    comprasMessage: '',
};

export const fetchTransacciones = createAsyncThunk(
    "compras/fetchTransacciones",
    async (comprasData: any, thunkAPI) => {
        try {
            return await comprasService.fetchTransacciones(comprasData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const graphTwo = createAsyncThunk(
    "compras/graphTwo",
    async (comprasData: any, thunkAPI) => {
        try {
            return await comprasService.graphTwo(comprasData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const comprar = createAsyncThunk(
    "compras/comprar",
    async (comprasData: any, thunkAPI) => {
        try {
            return await comprasService.comprar(comprasData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const vender = createAsyncThunk(
    "compras/vender",
    async (comprasData: any, thunkAPI) => {
        try {
            return await comprasService.vender(comprasData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const buySell = createAsyncThunk(
    "compras/buySell",
    async (comprasData: any, thunkAPI) => {
        try {
            return await comprasService.buySell(comprasData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const comprasSlice = createSlice({
    name: "compras",
    initialState,
    reducers: {
        reset: (state) => {
            state.comprasIsLoading = false
            state.comprasIsError = false
            state.comprasIsSuccess = false
            state.comprasMessage = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase( fetchTransacciones.pending, ( state ) =>
            {
                state.comprasIsLoading = true
            })
            .addCase( fetchTransacciones.fulfilled, ( state ) =>
            {
                state.comprasIsSuccess = true,
                state.comprasIsLoading = false
            })
            .addCase( fetchTransacciones.rejected, ( state, action) =>
            {
                state.comprasIsError = true,
                state.comprasIsLoading = false,
                state.comprasIsSuccess = false,
                state.comprasMessage = action.payload
            } )
            .addCase( graphTwo.pending, ( state ) =>
            {
                state.comprasIsLoading = true
            })
            .addCase( graphTwo.fulfilled, ( state ) =>
            {
                state.comprasIsSuccess = true,
                state.comprasIsLoading = false
            })
            .addCase( graphTwo.rejected, ( state, action) =>
            {
                state.comprasIsError = true,
                state.comprasIsLoading = false,
                state.comprasIsSuccess = false,
                state.comprasMessage = action.payload
            } )
            .addCase( comprar.pending, ( state ) =>
            {
                state.comprasIsLoading = true
            })
            .addCase( comprar.fulfilled, ( state ) =>
            {
                state.comprasIsSuccess = true,
                state.comprasIsLoading = false
            })
            .addCase( comprar.rejected, ( state, action) =>
            {
                state.comprasIsError = true,
                state.comprasIsLoading = false,
                state.comprasIsSuccess = false,
                state.comprasMessage = action.payload
            } )
            .addCase( vender.pending, ( state ) =>
            {
                state.comprasIsLoading = true
            })
            .addCase( vender.fulfilled, ( state ) =>
            {
                state.comprasIsSuccess = true,
                state.comprasIsLoading = false
            })
            .addCase( vender.rejected, ( state, action) =>
            {
                state.comprasIsError = true,
                state.comprasIsLoading = false,
                state.comprasIsSuccess = false,
                state.comprasMessage = action.payload
            } )
            .addCase( buySell.pending, ( state ) =>
            {
                state.comprasIsLoading = true
            })
            .addCase( buySell.fulfilled, ( state ) =>
            {
                state.comprasIsSuccess = true,
                state.comprasIsLoading = false
            })
            .addCase( buySell.rejected, ( state, action) =>
            {
                state.comprasIsError = true,
                state.comprasIsLoading = false,
                state.comprasIsSuccess = false,
                state.comprasMessage = action.payload
            } )

    }
})

export const { reset } = comprasSlice.actions

export default comprasSlice.reducer