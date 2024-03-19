import { configureStore } from '@reduxjs/toolkit';
import authReducer  from '../features/auth/authSlice'
import videoReducer from '../features/videos/videosSlice'
import perfilReducer from '../features/perfil/perfilSlice'
import quizReducer from '../features/quiz/quizSlice'
import chatReducer from '../features/chat/chatSlice'

import notificationReducer from '../features/notificationSlice'

export const store = configureStore({
	reducer: {
		auth: authReducer,
		videos: videoReducer,
		notifications: notificationReducer,
		perfil: perfilReducer,
		quiz: quizReducer,
		chat: chatReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
