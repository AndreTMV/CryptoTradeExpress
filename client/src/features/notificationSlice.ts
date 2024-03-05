import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface NotificationState {
    notifications: any;
    notificationIsError: boolean;
    notificationIsSuccess: boolean;
    notificationIsLoading: boolean;
    notificationMessage: string | false;
    notificationCount: number;
}

const initialState: NotificationState = {
    notifications: {},
    notificationIsError: false,
    notificationIsSuccess: false,
    notificationIsLoading: false,
    notificationMessage: '',
    notificationCount: 0
};

export const updateNotificationCount = (count: number) => (dispatch: any) => {
    "notifications/updateNotificationCount"
    dispatch(notificationSlice.actions.setNotificationCount(count));
};

export const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        reset: (state) => {
            state.notificationIsLoading = false;
            state.notificationIsError = false;
            state.notificationCount = 0;
            state.notificationMessage = false;
        },
        setNotificationCount: (state, action: PayloadAction<number>) => {
            state.notificationCount = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
    }
})

export const { reset } = notificationSlice.actions

export default notificationSlice.reducer
