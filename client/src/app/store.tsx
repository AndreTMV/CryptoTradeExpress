import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import videoReducer from '../features/videos/videosSlice'
import perfilReducer from '../features/perfil/perfilSlice'
import quizReducer from '../features/quiz/quizSlice'
import chatReducer from '../features/chat/chatSlice'
import predictionsReducer from '../features/predictions/predictionsSlice';
import comprasReducer from '../features/compras/comprasSlice';
import priceReducer from '../features/prices/priceSlice'
import friendReducer from '../features/amigos/friendSlice';
import noticiaReducer from '../features/noticias/noticiaSlice';
import carteraReducer from '../features/cartera/carteraSlice';
import botReducer from '../features/bot/botSlice';
import simuladorReducer from '../features/simulador/simuladorSlice';

import notificationReducer from '../features/notificationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    videos: videoReducer,
    notifications: notificationReducer,
    perfil: perfilReducer,
    quiz: quizReducer,
    chat: chatReducer,
    predictions: predictionsReducer,
    compras: comprasReducer,
    prices: priceReducer,
    friends: friendReducer,
    news: noticiaReducer,
    cartera: carteraReducer,
    bot: botReducer,
    simulation: simuladorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
