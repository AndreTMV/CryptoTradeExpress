import { configureStore } from '@reduxjs/toolkit';
import authReducer  from '../features/auth/authSlice'
import videoReducer from '../features/videos/videosSlice'
import notificationReducer from '../features/notificationSlice'
export const store = configureStore({
	reducer: {
		auth: authReducer,
		videos: videoReducer,
		notifications: notificationReducer,
	},
});
