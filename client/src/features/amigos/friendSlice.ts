//import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
//import friendService from './friendService';
//
//interface FriendState {
//    friends: any;
//    friendIsError: boolean;
//    friendIsSuccess: boolean;
//    friendIsLoading: boolean;
//    friendMessage: string;
//}
//
//const initialState: FriendState = {
//    friends: {},
//    friendIsError: false,
//    friendIsSuccess: false,
//    friendIsLoading: false,
//    friendMessage: '',
//};
//
//export const fetchFriends = createAsyncThunk(
//    "friends/fetchFriends",
//    async (friendsData: any, thunkAPI) => {
//        try {
//            return await friendService.fetchFriends(friendsData)
//        } catch (error) {
//            const message = (error.response && error.response.data
//                && error.response.data.message) ||
//                error.message || error.toString()
//
//            return thunkAPI.rejectWithValue(message)
//        }
//    }
//)
//
//export const areFriends = createAsyncThunk(
//    "friends/areFriends",
//    async (friendsData: any, thunkAPI) => {
//        try {
//            return await friendService.areFriends(friendsData)
//        } catch (error) {
//            const message = (error.response && error.response.data
//                && error.response.data.message) ||
//                error.message || error.toString()
//
//            return thunkAPI.rejectWithValue(message)
//        }
//    }
//)
//
//export const removeFriend = createAsyncThunk(
//    "friends/removeFriend",
//    async (friendsData: any, thunkAPI) => {
//        try {
//            return await friendService.removeFriend(friendsData)
//        } catch (error) {
//            const message = (error.response && error.response.data
//                && error.response.data.message) ||
//                error.message || error.toString()
//
//            return thunkAPI.rejectWithValue(message)
//        }
//    }
//)
//
//export const sendFriendRequest = createAsyncThunk(
//    "friends/sendFriendRequest",
//    async (friendsData: any, thunkAPI) => {
//        try {
//            return await friendService.sendFriendRequest(friendsData)
//        } catch (error) {
//            const message = (error.response && error.response.data
//                && error.response.data.message) ||
//                error.message || error.toString()
//
//            return thunkAPI.rejectWithValue(message)
//        }
//    }
//)
//
//export const friendRequestStatus = createAsyncThunk(
//    "friends/friendRequestStatus",
//    async (friendsData: any, thunkAPI) => {
//        try {
//            return await friendService.friendRequestStatus(friendsData)
//        } catch (error) {
//            const message = (error.response && error.response.data
//                && error.response.data.message) ||
//                error.message || error.toString()
//
//            return thunkAPI.rejectWithValue(message)
//        }
//    }
//)
//
//export const cancelFriendRequest = createAsyncThunk(
//    "friends/cancelFriendRequest",
//    async (friendsData: any, thunkAPI) => {
//        try {
//            return await friendService.cancelFriendRequest(friendsData)
//        } catch (error) {
//            const message = (error.response && error.response.data
//                && error.response.data.message) ||
//                error.message || error.toString()
//
//            return thunkAPI.rejectWithValue(message)
//        }
//    }
//)
//
//export const fetchFriendRequests = createAsyncThunk(
//    "friends/fetchFriendRequests",
//    async (friendsData: any, thunkAPI) => {
//        try {
//            return await friendService.fetchFriendRequests(friendsData)
//        } catch (error) {
//            const message = (error.response && error.response.data
//                && error.response.data.message) ||
//                error.message || error.toString()
//
//            return thunkAPI.rejectWithValue(message)
//        }
//    }
//)
//
//export const declineFriendRequest = createAsyncThunk(
//    "friends/declineFriendRequest",
//    async (friendsData: any, thunkAPI) => {
//        try {
//            return await friendService.declineFriendRequest(friendsData)
//        } catch (error) {
//            const message = (error.response && error.response.data
//                && error.response.data.message) ||
//                error.message || error.toString()
//
//            return thunkAPI.rejectWithValue(message)
//        }
//    }
//)
//
//export const acceptFriendRequest = createAsyncThunk(
//    "friends/acceptFriendRequest",
//    async (friendsData: any, thunkAPI) => {
//        try {
//            return await friendService.acceptFriendRequest(friendsData)
//        } catch (error) {
//            const message = (error.response && error.response.data
//                && error.response.data.message) ||
//                error.message || error.toString()
//
//            return thunkAPI.rejectWithValue(message)
//        }
//    }
//)
//
//export const friendSlice = createSlice({
//    name: "friends",
//    initialState,
//    reducers: {
//        friendReset: (state) => {
//            state.friendIsLoading = false
//            state.friendIsError = false
//            state.friendIsSuccess = false
//            state.friendMessage = ''
//        }
//    },
//    extraReducers: (builder) => {
//        builder
//            .addCase( fetchFriends.pending, ( state ) =>
//            {
//                state.friendIsLoading = true
//            })
//            .addCase( fetchFriends.fulfilled, ( state ) =>
//            {
//                state.friendIsSuccess = true,
//                state.friendIsLoading = false
//            })
//            .addCase( fetchFriends.rejected, ( state, action) =>
//            {
//                state.friendIsError = true,
//                state.friendIsLoading = false,
//                state.friendIsSuccess = false,
//                state.friendMessage = action.payload
//            } )
//            .addCase( areFriends.fulfilled, ( state, action ) =>
//            {
//                state.friendMessage = action.payload
//            })
//            .addCase( removeFriend.pending, ( state ) =>
//            {
//                state.friendIsLoading = true
//            })
//            .addCase( removeFriend.fulfilled, ( state ) =>
//            {
//                state.friendIsSuccess = true,
//                state.friendIsLoading = false
//            })
//            .addCase( removeFriend.rejected, ( state, action) =>
//            {
//                state.friendIsError = true,
//                state.friendIsLoading = false,
//                state.friendIsSuccess = false,
//                state.friendMessage = action.payload
//            } )
//            .addCase( sendFriendRequest.pending, ( state ) =>
//            {
//                state.friendIsLoading = true
//            })
//            .addCase( sendFriendRequest.fulfilled, ( state ) =>
//            {
//                state.friendIsSuccess = true,
//                state.friendIsLoading = false
//            })
//            .addCase( sendFriendRequest.rejected, ( state, action) =>
//            {
//                state.friendIsError = true,
//                state.friendIsLoading = false,
//                state.friendIsSuccess = false,
//                state.friendMessage = action.payload
//            } )
//            .addCase( friendRequestStatus.fulfilled, ( state, action ) =>
//            {
//                state.friends = action.payload
//            })
//            .addCase( cancelFriendRequest.pending, ( state ) =>
//            {
//                state.friendIsLoading = true
//            })
//            .addCase( cancelFriendRequest.fulfilled, ( state ) =>
//            {
//                state.friendIsSuccess = true,
//                state.friendIsLoading = false
//            })
//            .addCase( cancelFriendRequest.rejected, ( state, action) =>
//            {
//                state.friendIsError = true,
//                state.friendIsLoading = false,
//                state.friendIsSuccess = false,
//                state.friendMessage = action.payload
//            } )
//            .addCase( fetchFriendRequests.fulfilled, ( state, action ) =>
//            {
//                state.friends = action.payload
//            })
//            .addCase( acceptFriendRequest.pending, ( state ) =>
//            {
//                state.friendIsLoading = true
//            })
//            .addCase( acceptFriendRequest.fulfilled, ( state ) =>
//            {
//                state.friendIsSuccess = true,
//                state.friendIsLoading = false
//            })
//            .addCase( acceptFriendRequest.rejected, ( state, action) =>
//            {
//                state.friendIsError = true,
//                state.friendIsLoading = false,
//                state.friendIsSuccess = false,
//                state.friendMessage = action.payload
//            } )
//            .addCase( declineFriendRequest.pending, ( state ) =>
//            {
//                state.friendIsLoading = true
//            })
//            .addCase( declineFriendRequest.fulfilled, ( state ) =>
//            {
//                state.friendIsSuccess = true,
//                state.friendIsLoading = false
//            })
//            .addCase( declineFriendRequest.rejected, ( state, action) =>
//            {
//                state.friendIsError = true,
//                state.friendIsLoading = false,
//                state.friendIsSuccess = false,
//                state.friendMessage = action.payload
//            } )
//    }
//})
//
//export const { friendReset } = friendSlice.actions
//
//export default friendSlice.reducer
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import friendService from "./friendService";
import type {
  FriendsState,
  FriendSummary,
  FriendRequestDTO,
  FetchFriendsDTO,
  AreFriendsDTO,
  RemoveFriendDTO,
  SendFriendRequestDTO,
  FriendRequestStatusDTO,
  CancelFriendRequestDTO,
  FetchFriendRequestsDTO,
  AcceptDeclineDTO,
  SimpleStatus,
} from "./types";

type Reject = string;

const initialState: FriendsState = {
  friends: [],
  requests: [],
  areFriends: null,
  requestExists: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: null,
};

const getErr = (e: any) => e?.response?.data?.message || e?.response?.data?.status || e?.message || "Error inesperado";

export const fetchFriends = createAsyncThunk<FriendSummary[], FetchFriendsDTO, { rejectValue: Reject }>(
  "friends/fetchFriends",
  async (payload, thunkAPI) => {
    try { return await friendService.fetchFriends(payload); }
    catch (e: any) { return thunkAPI.rejectWithValue(getErr(e)); }
  }
);

export const areFriends = createAsyncThunk<boolean | null, AreFriendsDTO, { rejectValue: Reject }>(
  "friends/areFriends",
  async (payload, thunkAPI) => {
    try { return await friendService.areFriends(payload); }
    catch (e: any) { return thunkAPI.rejectWithValue(getErr(e)); }
  }
);

export const removeFriend = createAsyncThunk<SimpleStatus, RemoveFriendDTO, { rejectValue: Reject }>(
  "friends/removeFriend",
  async (payload, thunkAPI) => {
    try { return await friendService.removeFriend(payload); }
    catch (e: any) { return thunkAPI.rejectWithValue(getErr(e)); }
  }
);

export const sendFriendRequest = createAsyncThunk<SimpleStatus, SendFriendRequestDTO, { rejectValue: Reject }>(
  "friends/sendFriendRequest",
  async (payload, thunkAPI) => {
    try { return await friendService.sendFriendRequest(payload); }
    catch (e: any) { return thunkAPI.rejectWithValue(getErr(e)); }
  }
);

export const friendRequestStatus = createAsyncThunk<boolean, FriendRequestStatusDTO, { rejectValue: Reject }>(
  "friends/friendRequestStatus",
  async (payload, thunkAPI) => {
    try { return await friendService.friendRequestStatus(payload); }
    catch (e: any) { return thunkAPI.rejectWithValue(getErr(e)); }
  }
);

export const cancelFriendRequest = createAsyncThunk<SimpleStatus, CancelFriendRequestDTO, { rejectValue: Reject }>(
  "friends/cancelFriendRequest",
  async (payload, thunkAPI) => {
    try { return await friendService.cancelFriendRequest(payload); }
    catch (e: any) { return thunkAPI.rejectWithValue(getErr(e)); }
  }
);

export const fetchFriendRequests = createAsyncThunk<FriendRequestDTO[], FetchFriendRequestsDTO, { rejectValue: Reject }>(
  "friends/fetchFriendRequests",
  async (payload, thunkAPI) => {
    try { return await friendService.fetchFriendRequests(payload); }
    catch (e: any) { return thunkAPI.rejectWithValue(getErr(e)); }
  }
);

export const declineFriendRequest = createAsyncThunk<SimpleStatus, AcceptDeclineDTO, { rejectValue: Reject }>(
  "friends/declineFriendRequest",
  async (payload, thunkAPI) => {
    try { return await friendService.declineFriendRequest(payload); }
    catch (e: any) { return thunkAPI.rejectWithValue(getErr(e)); }
  }
);

export const acceptFriendRequest = createAsyncThunk<SimpleStatus, AcceptDeclineDTO, { rejectValue: Reject }>(
  "friends/acceptFriendRequest",
  async (payload, thunkAPI) => {
    try { return await friendService.acceptFriendRequest(payload); }
    catch (e: any) { return thunkAPI.rejectWithValue(getErr(e)); }
  }
);

const friendSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    friendReset: (s) => {
      s.isLoading = false;
      s.isError = false;
      s.isSuccess = false;
      s.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFriends
      .addCase(fetchFriends.pending, (s) => { s.isLoading = true; })
      .addCase(fetchFriends.fulfilled, (s, a: PayloadAction<FriendSummary[]>) => {
        s.isLoading = false; s.isSuccess = true; s.friends = a.payload;
      })
      .addCase(fetchFriends.rejected, (s, a) => {
        s.isLoading = false; s.isError = true; s.message = (a.payload as string) ?? "Error";
      })

      // areFriends
      .addCase(areFriends.pending, (s) => { s.isLoading = true; })
      .addCase(areFriends.fulfilled, (s, a: PayloadAction<boolean | null>) => {
        s.isLoading = false; s.isSuccess = true; s.areFriends = a.payload;
      })
      .addCase(areFriends.rejected, (s, a) => {
        s.isLoading = false; s.isError = true; s.message = (a.payload as string) ?? "Error";
      })

      // friendRequestStatus
      .addCase(friendRequestStatus.fulfilled, (s, a: PayloadAction<boolean>) => {
        s.requestExists = a.payload;
      })

      // fetchFriendRequests
      .addCase(fetchFriendRequests.pending, (s) => { s.isLoading = true; })
      .addCase(fetchFriendRequests.fulfilled, (s, a: PayloadAction<FriendRequestDTO[]>) => {
        s.isLoading = false; s.requests = a.payload;
      })
      .addCase(fetchFriendRequests.rejected, (s, a) => {
        s.isLoading = false; s.isError = true; s.message = (a.payload as string) ?? "Error";
      })

      // Acciones con SimpleStatus (no modifican listas aquí)
      .addCase(removeFriend.pending, (s) => { s.isLoading = true; })
      .addCase(removeFriend.fulfilled, (s) => {
        s.isLoading = false; s.isSuccess = true;
      })
      .addCase(removeFriend.rejected, (s, a) => {
        s.isLoading = false; s.isError = true; s.isSuccess = false; s.message = (a.payload as string) ?? "Error";
      })

      .addCase(sendFriendRequest.pending, (s) => { s.isLoading = true; })
      .addCase(sendFriendRequest.fulfilled, (s) => {
        s.isLoading = false; s.isSuccess = true;
      })
      .addCase(sendFriendRequest.rejected, (s, a) => {
        s.isLoading = false; s.isError = true; s.isSuccess = false; s.message = (a.payload as string) ?? "Error";
      })

      .addCase(cancelFriendRequest.pending, (s) => { s.isLoading = true; })
      .addCase(cancelFriendRequest.fulfilled, (s) => {
        s.isLoading = false; s.isSuccess = true;
      })
      .addCase(cancelFriendRequest.rejected, (s, a) => {
        s.isLoading = false; s.isError = true; s.isSuccess = false; s.message = (a.payload as string) ?? "Error";
      })

      .addCase(acceptFriendRequest.pending, (s) => { s.isLoading = true; })
      .addCase(acceptFriendRequest.fulfilled, (s) => {
        s.isLoading = false; s.isSuccess = true;
      })
      .addCase(acceptFriendRequest.rejected, (s, a) => {
        s.isLoading = false; s.isError = true; s.isSuccess = false; s.message = (a.payload as string) ?? "Error";
      })

      .addCase(declineFriendRequest.pending, (s) => { s.isLoading = true; })
      .addCase(declineFriendRequest.fulfilled, (s) => {
        s.isLoading = false; s.isSuccess = true;
      })
      .addCase(declineFriendRequest.rejected, (s, a) => {
        s.isLoading = false; s.isError = true; s.isSuccess = false; s.message = (a.payload as string) ?? "Error";
      });
  },
});

export const { friendReset } = friendSlice.actions;
export default friendSlice.reducer;
