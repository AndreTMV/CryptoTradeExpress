import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface NotificationState {
    notifications: any;
    notificationIsError: boolean;
    notificationIsSuccess: boolean;
    notificationIsLoading: boolean;
    notificationMessage: string | false;
    notificationCount: number;
    notificationsInformation: string[];

}

const initialState: NotificationState = {
    notifications: {},
    notificationIsError: false,
    notificationIsSuccess: false,
    notificationIsLoading: false,
    notificationMessage: '',
    notificationCount: 0,
    notificationsInformation: [],

};

export const updateNotificationCount = (count: number) => (dispatch: any) => {
    "notifications/updateNotificationCount"
    dispatch(notificationSlice.actions.setNotificationCount(count));
};

export const addNotification = (notification: string) => (dispatch: any) => {
    dispatch(notificationSlice.actions.addNotification(notification));
};

export const clearNotifications = () => (dispatch: any) => {
    dispatch(notificationSlice.actions.clearNotifications());
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
        addNotification: (state, action: PayloadAction<string>) => {
            state.notificationsInformation.push(action.payload);
            state.notificationCount += 1;
        },
        clearNotifications: (state) => {
            state.notificationsInformation = [];
            state.notificationCount = 0;
        },
    },
    extraReducers: (builder) => {
        builder
    }
})

export const { reset } = notificationSlice.actions

export default notificationSlice.reducer
