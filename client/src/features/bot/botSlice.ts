import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import botService from './botService';

interface BotState {
    bot: {
        purchases: any[];
        sales: any[];
    };
    botIsError: boolean;
    botIsSuccess: boolean;
    botIsLoading: boolean;
    botMessage: string;
}

const initialState: BotState = {
    bot: {
        purchases: [],
        sales: []
    },
    botIsError: false,
    botIsSuccess: false,
    botIsLoading: false,
    botMessage: '',
};

export const fetchSales = createAsyncThunk(
    "compras/fetchSales",
    async (comprasData: any, thunkAPI) => {
        try {
            return await botService.fetchSales(comprasData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const fetchPurchases = createAsyncThunk(
    "compras/fetchPurchases",
    async (comprasData: any, thunkAPI) => {
        try {
            return await botService.fetchPurchases(comprasData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const botSlice = createSlice({
    name: "bot",
    initialState,
    reducers: {
        reset: (state) => {
            state.botIsLoading = false;
            state.botIsError = false;
            state.botIsSuccess = false;
            state.botMessage = '';
            state.bot = {
                purchases: [],
                sales: []
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSales.pending, (state) => {
                state.botIsLoading = true;
            })
            .addCase(fetchSales.fulfilled, (state, action) => {
                state.botIsSuccess = true;
                state.botIsLoading = false;
                state.bot.sales = action.payload;
            })
            .addCase(fetchSales.rejected, (state, action) => {
                state.botIsError = true;
                state.botIsLoading = false;
                state.botIsSuccess = false;
                state.botMessage = action.payload;
            })
            .addCase(fetchPurchases.pending, (state) => {
                state.botIsLoading = true;
            })
            .addCase(fetchPurchases.fulfilled, (state, action) => {
                state.botIsSuccess = true;
                state.botIsLoading = false;
                state.bot.purchases = action.payload;
            })
            .addCase(fetchPurchases.rejected, (state, action) => {
                state.botIsError = true;
                state.botIsLoading = false;
                state.botIsSuccess = false;
                state.botMessage = action.payload;
            });
    }
});

export const { reset } = botSlice.actions;

export default botSlice.reducer;
