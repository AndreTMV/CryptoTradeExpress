import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import predictionsService from './predictionsService';

interface PredictionState {
    cryptos: any
    predictionIsError: boolean;
    predictionIsSuccess: boolean;
    predictionIsLoading: boolean;
    predictionMessage: string;
}

const initialState: PredictionState = {
    cryptos: {},
    predictionIsError: false,
    predictionIsSuccess: false,
    predictionIsLoading: false,
    predictionMessage: '',
};

export const getCryptos = createAsyncThunk(
    "predictions/getCryptos",
    async (_, thunkAPI) => {
        try {
            return await predictionsService.getCryptos()
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const graphPrediction = createAsyncThunk(
    "predictions/graphPrediction",
    async (cryptoData:any, thunkAPI) => {
        try {
            return await predictionsService.graphPrediction(cryptoData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const graphLast10Days = createAsyncThunk(
    "predictions/graphLast10Days",
    async (cryptoData:any, thunkAPI) => {
        try {
            return await predictionsService.graphLast10Days(cryptoData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)
export const predictionsSlice = createSlice({
    name: "predictions",
    initialState,
    reducers: {
        reset: (state) => {
            state.predictionIsError = false
            state.predictionIsLoading = false
            state.predictionIsSuccess = false
            state.predictionMessage = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase( getCryptos.pending, ( state ) =>
            {
                state.predictionIsLoading = true
            })
            .addCase( getCryptos.fulfilled, ( state, action ) =>
            {
                state.predictionIsSuccess = true,
                state.predictionIsLoading = false
                state.cryptos = action.payload
            })
            .addCase( getCryptos.rejected, ( state, action) =>
            {
                state.predictionIsError = true,
                state.predictionIsLoading = false,
                state.predictionIsSuccess = false,
                state.predictionMessage = action.payload
            } )
            .addCase( graphPrediction.pending, ( state ) =>
            {
                state.predictionIsLoading = true
            })
            .addCase( graphPrediction.fulfilled, ( state, action ) =>
            {
                state.predictionIsSuccess = true,
                state.predictionIsLoading = false
                state.cryptos = action.payload
            })
            .addCase( graphPrediction.rejected, ( state, action) =>
            {
                state.predictionIsError = true,
                state.predictionIsLoading = false,
                state.predictionIsSuccess = false,
                state.predictionMessage = action.payload
            })
            .addCase( graphLast10Days.pending, ( state ) =>
            {
                state.predictionIsLoading = true
            })
            .addCase( graphLast10Days.fulfilled, ( state, action ) =>
            {
                state.predictionIsSuccess = true,
                state.predictionIsLoading = false
                state.cryptos = action.payload
            })
            .addCase( graphLast10Days.rejected, ( state, action) =>
            {
                state.predictionIsError = true,
                state.predictionIsLoading = false,
                state.predictionIsSuccess = false,
                state.predictionMessage = action.payload
            })
    }
})

export const { reset } = predictionsSlice.actions

export default predictionsSlice.reducer