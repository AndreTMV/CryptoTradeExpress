import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import priceService from './priceService';

interface PriceState {
    prices: any;
    priceIsError: boolean;
    priceIsSuccess: boolean;
    priceIsLoading: boolean;
    priceMessage: string;
}

const initialState: PriceState = {
    prices: {},
    priceIsError: false,
    priceIsSuccess: false,
    priceIsLoading: false,
    priceMessage: '',
};

export const createPriceAlert = createAsyncThunk(
    "prices/createPriceAlert",
    async (priceData: any, thunkAPI) => {
        try {
            return await priceService.createPriceAlert(priceData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const priceSlice = createSlice({
    name: "prices",
    initialState,
    reducers: {
        reset: (state) => {
            state.priceIsLoading = false
            state.priceIsError = false
            state.priceIsSuccess = false
            state.priceMessage = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase( createPriceAlert.pending, ( state ) =>
            {
                state.priceIsLoading = true
            })
            .addCase( createPriceAlert.fulfilled, ( state ) =>
            {
                state.priceIsSuccess = true,
                state.priceIsLoading = false
            })
            .addCase( createPriceAlert.rejected, ( state, action) =>
            {
                state.priceIsError = true,
                state.priceIsLoading = false,
                state.priceIsSuccess = false,
                state.priceMessage = action.payload
            } )
    }
})

export const { reset } = priceSlice.actions

export default priceSlice.reducer