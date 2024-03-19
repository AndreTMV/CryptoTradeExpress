import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import chatService from './chatService';

interface ChatState {
    message: any;
    chatIsError: boolean;
    chatIsSuccess: boolean;
    chatIsLoading: boolean;
    chatMessage: string;
}

const initialState: ChatState = {
    message: {},
    chatIsError: false,
    chatIsSuccess: false,
    chatIsLoading: false,
    chatMessage: '',
};

export const getMyMessages = createAsyncThunk(
    "chat/getMyMessages",
    async (userId: number, thunkAPI) => {
        try {
            return await chatService.getMyMessages(userId)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getMessages = createAsyncThunk(
    "chat/getMessages",
    async ({ senderId, receiverId }: { senderId: number, receiverId: number }, thunkAPI) => {
        try {
            return await chatService.getMessages(senderId, receiverId)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async (messageData: any, thunkAPI) => {
        try {
            return await chatService.sendMessage(messageData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const searchUser = createAsyncThunk(
    "chat/searchUser",
    async (username: string, thunkAPI) => {
        try {
            return await chatService.searchUser(username)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)
export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        reset: (state) => {
            state.chatIsLoading = false
            state.chatIsError = false
            state.chatIsSuccess = false
            state.chatMessage = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase( getMyMessages.pending, ( state ) =>
            {
                state.chatIsLoading = true
            })
            .addCase( getMyMessages.fulfilled, ( state ) =>
            {
                state.chatIsSuccess = true,
                state.chatIsLoading = false
            })
            .addCase( getMyMessages.rejected, ( state, action) =>
            {
                state.chatIsError = true,
                state.chatIsLoading = false,
                state.chatIsSuccess = false,
                state.chatMessage = action.payload
            } )
            .addCase( getMessages.pending, ( state ) =>
            {
                state.chatIsLoading = true
            })
            .addCase( getMessages.fulfilled, ( state ) =>
            {
                state.chatIsSuccess = true,
                state.chatIsLoading = false
            })
            .addCase( getMessages.rejected, ( state, action) =>
            {
                state.chatIsError = true,
                state.chatIsLoading = false,
                state.chatIsSuccess = false,
                state.chatMessage = action.payload
            } )
            .addCase( sendMessage.pending, ( state ) =>
            {
                state.chatIsLoading = true
            })
            .addCase( sendMessage.fulfilled, ( state, action ) =>
            {
                state.chatIsSuccess = true,
                state.chatIsLoading = false
                state.message = action.payload
            })
            .addCase( sendMessage.rejected, ( state, action) =>
            {
                state.chatIsError = true,
                state.chatIsLoading = false,
                state.chatIsSuccess = false,
                state.chatMessage = action.payload
            } )
            .addCase( searchUser.pending, ( state ) =>
            {
                state.chatIsLoading = true
            })
            .addCase( searchUser.fulfilled, ( state, action ) =>
            {
                state.chatIsSuccess = true,
                state.chatIsLoading = false
                state.message = action.payload
            })
            .addCase( searchUser.rejected, ( state, action) =>
            {
                state.chatIsError = true,
                state.chatIsLoading = false,
                state.chatIsSuccess = false,
                state.chatMessage = action.payload
            } )
    }
})

export const { reset } = chatSlice.actions

export default chatSlice.reducer