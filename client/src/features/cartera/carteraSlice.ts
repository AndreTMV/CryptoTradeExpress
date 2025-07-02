import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import carteraService from './carteraService';

interface PriceState {
    cartera: any;
    carteraIsError: boolean;
    carteraIsSuccess: boolean;
    carteraIsLoading: boolean;
    carteraMessage: string;
}

const initialState: PriceState = {
    cartera: {},
    carteraIsError: false,
    carteraIsSuccess: false,
    carteraIsLoading: false,
    carteraMessage: '',
};

export const getBinanceInfoUser = createAsyncThunk(
    "cartera/getBinanceInfoUser",
    async (carteraData: any, thunkAPI) => {
        try {
            return await carteraService.getUserInfo(carteraData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const carteraSlice = createSlice({
    name: "cartera",
    initialState,
    reducers: {
        reset: (state) => {
            state.carteraIsLoading = false
            state.carteraIsError = false
            state.carteraIsSuccess = false
            state.carteraMessage = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase( getBinanceInfoUser.pending, ( state ) =>
            {
                state.carteraIsLoading = true
            })
            .addCase( getBinanceInfoUser.fulfilled, ( state,action ) =>
            {
                state.carteraIsSuccess = true,
                state.carteraIsLoading = false
                state.cartera = action.payload
            })
            .addCase( getBinanceInfoUser.rejected, ( state, action) =>
            {
                state.carteraIsError = true,
                state.carteraIsLoading = false,
                state.carteraIsSuccess = false,
                state.carteraMessage = action.payload
            } )
    }
})

export const { reset } = carteraSlice.actions

export default carteraSlice.reducer