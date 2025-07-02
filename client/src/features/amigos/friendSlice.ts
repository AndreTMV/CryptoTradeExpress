import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import friendService from './friendService';

interface FriendState {
    friends: any;
    friendIsError: boolean;
    friendIsSuccess: boolean;
    friendIsLoading: boolean;
    friendMessage: string;
}

const initialState: FriendState = {
    friends: {},
    friendIsError: false,
    friendIsSuccess: false,
    friendIsLoading: false,
    friendMessage: '',
};

export const fetchFriends = createAsyncThunk(
    "friends/fetchFriends",
    async (friendsData: any, thunkAPI) => {
        try {
            return await friendService.fetchFriends(friendsData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const areFriends = createAsyncThunk(
    "friends/areFriends",
    async (friendsData: any, thunkAPI) => {
        try {
            return await friendService.areFriends(friendsData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const removeFriend = createAsyncThunk(
    "friends/removeFriend",
    async (friendsData: any, thunkAPI) => {
        try {
            return await friendService.removeFriend(friendsData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const sendFriendRequest = createAsyncThunk(
    "friends/sendFriendRequest",
    async (friendsData: any, thunkAPI) => {
        try {
            return await friendService.sendFriendRequest(friendsData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const friendRequestStatus = createAsyncThunk(
    "friends/friendRequestStatus",
    async (friendsData: any, thunkAPI) => {
        try {
            return await friendService.friendRequestStatus(friendsData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const cancelFriendRequest = createAsyncThunk(
    "friends/cancelFriendRequest",
    async (friendsData: any, thunkAPI) => {
        try {
            return await friendService.cancelFriendRequest(friendsData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const fetchFriendRequests = createAsyncThunk(
    "friends/fetchFriendRequests",
    async (friendsData: any, thunkAPI) => {
        try {
            return await friendService.fetchFriendRequests(friendsData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const declineFriendRequest = createAsyncThunk(
    "friends/declineFriendRequest",
    async (friendsData: any, thunkAPI) => {
        try {
            return await friendService.declineFriendRequest(friendsData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const acceptFriendRequest = createAsyncThunk(
    "friends/acceptFriendRequest",
    async (friendsData: any, thunkAPI) => {
        try {
            return await friendService.acceptFriendRequest(friendsData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const friendSlice = createSlice({
    name: "friends",
    initialState,
    reducers: {
        friendReset: (state) => {
            state.friendIsLoading = false
            state.friendIsError = false
            state.friendIsSuccess = false
            state.friendMessage = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase( fetchFriends.pending, ( state ) =>
            {
                state.friendIsLoading = true
            })
            .addCase( fetchFriends.fulfilled, ( state ) =>
            {
                state.friendIsSuccess = true,
                state.friendIsLoading = false
            })
            .addCase( fetchFriends.rejected, ( state, action) =>
            {
                state.friendIsError = true,
                state.friendIsLoading = false,
                state.friendIsSuccess = false,
                state.friendMessage = action.payload
            } )
            .addCase( areFriends.fulfilled, ( state, action ) =>
            {
                state.friendMessage = action.payload
            })
            .addCase( removeFriend.pending, ( state ) =>
            {
                state.friendIsLoading = true
            })
            .addCase( removeFriend.fulfilled, ( state ) =>
            {
                state.friendIsSuccess = true,
                state.friendIsLoading = false
            })
            .addCase( removeFriend.rejected, ( state, action) =>
            {
                state.friendIsError = true,
                state.friendIsLoading = false,
                state.friendIsSuccess = false,
                state.friendMessage = action.payload
            } )
            .addCase( sendFriendRequest.pending, ( state ) =>
            {
                state.friendIsLoading = true
            })
            .addCase( sendFriendRequest.fulfilled, ( state ) =>
            {
                state.friendIsSuccess = true,
                state.friendIsLoading = false
            })
            .addCase( sendFriendRequest.rejected, ( state, action) =>
            {
                state.friendIsError = true,
                state.friendIsLoading = false,
                state.friendIsSuccess = false,
                state.friendMessage = action.payload
            } )
            .addCase( friendRequestStatus.fulfilled, ( state, action ) =>
            {
                state.friends = action.payload
            })
            .addCase( cancelFriendRequest.pending, ( state ) =>
            {
                state.friendIsLoading = true
            })
            .addCase( cancelFriendRequest.fulfilled, ( state ) =>
            {
                state.friendIsSuccess = true,
                state.friendIsLoading = false
            })
            .addCase( cancelFriendRequest.rejected, ( state, action) =>
            {
                state.friendIsError = true,
                state.friendIsLoading = false,
                state.friendIsSuccess = false,
                state.friendMessage = action.payload
            } )
            .addCase( fetchFriendRequests.fulfilled, ( state, action ) =>
            {
                state.friends = action.payload
            })
            .addCase( acceptFriendRequest.pending, ( state ) =>
            {
                state.friendIsLoading = true
            })
            .addCase( acceptFriendRequest.fulfilled, ( state ) =>
            {
                state.friendIsSuccess = true,
                state.friendIsLoading = false
            })
            .addCase( acceptFriendRequest.rejected, ( state, action) =>
            {
                state.friendIsError = true,
                state.friendIsLoading = false,
                state.friendIsSuccess = false,
                state.friendMessage = action.payload
            } )
            .addCase( declineFriendRequest.pending, ( state ) =>
            {
                state.friendIsLoading = true
            })
            .addCase( declineFriendRequest.fulfilled, ( state ) =>
            {
                state.friendIsSuccess = true,
                state.friendIsLoading = false
            })
            .addCase( declineFriendRequest.rejected, ( state, action) =>
            {
                state.friendIsError = true,
                state.friendIsLoading = false,
                state.friendIsSuccess = false,
                state.friendMessage = action.payload
            } )
    }
})

export const { friendReset } = friendSlice.actions

export default friendSlice.reducer