import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import noticiaService from './noticiaService';

interface PriceState {
    news: any;
    newsIsError: boolean;
    newsIsSuccess: boolean;
    newsIsLoading: boolean;
    newsMessage: string;
}

const initialState: PriceState = {
    news: {},
    newsIsError: false,
    newsIsSuccess: false,
    newsIsLoading: false,
    newsMessage: '',
};

export const fetchNews = createAsyncThunk(
    "news/fetchNews",
    async (_, thunkAPI) => {
        try {
            return await noticiaService.fetchNews()
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const noticiaSlice = createSlice({
    name: "news",
    initialState,
    reducers: {
        reset: (state) => {
            state.newsIsLoading = false
            state.newsIsError = false
            state.newsIsSuccess = false
            state.newsMessage = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase( fetchNews.fulfilled, ( state, action ) =>
            {
                state.news = action.payload
            })

    }
})

export const { reset } = noticiaSlice.actions

export default noticiaSlice.reducer