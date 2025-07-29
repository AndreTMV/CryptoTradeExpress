import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from './pages/login/loginPage';
import { CreateUserPage } from './pages/login/createUserPage';
import Dashboard from './pages/DashBoard';
import { ResetPasswordPage } from './pages/login/ResetPasswordPage';
import { ActivationPage } from './pages/login/ActivatePage';
import NotFoundPage from './pages/login/NotFoundPage';
import { ResetPasswordPageConfirm } from './pages/login/ResetPasswordConfirmPage';
import Nav from "./components/Nav";
import { OTPVerification } from './pages/login/OTPVerification';
import UploadedVideosPage from './pages/videos/videoMain';
import { UploadVideoPage } from './pages/videos/uploadVideoForm';
import VideosSectionPage from './pages/videos/videosSection';
import { UploadSection } from './pages/videos/uploadSection';
import { DeleteSection } from './pages/videos/deleteSection';
import NotAcceptedVideosPage from './pages/videos/noAcceptedVideos';
import { CreatePerfilPage } from './pages/perfil/createPerfilForm';
import { ActualizarPerfilPage } from './pages/perfil/updatePerfil';
import { CreateQuizPage } from './pages/quiz/createQuizForm';
import { AddQuestionsPage } from './pages/quiz/addQuestionsForm';
import RenderQuizPage from './pages/quiz/renderQuizPage';
import QuizThumbnails from './pages/quiz/renderAllQuizes';
import RenderAnswerQuizPage from './pages/quiz/renderAnswerQuizPage';
import ReportThumbnails from './pages/quiz/renderReport';
import { UpdateQuestionsPage } from './pages/quiz/updateQuestionsForm';
import Message from './pages/chat/message';
import MessageDetail from './pages/chat/messageDetail';
import SearchUsers from './pages/chat/searchUsers';
import ChooseCrypto from './pages/predictions/chooseCrypto';
import GraphPrediction from './pages/predictions/graph';
import ChooseCrypto10 from './pages/predictions/last10daysChoose';
import GraphLast10Days from './pages/predictions/last10DaysGraph';
import SeeTransactions from './pages/compras/transacciones';
import TransactionsTable from './pages/compras/seeTransactions';
import GraphDates from './pages/compras/graphs';
import GenerateGraph from './pages/compras/generateGraph';
import PriceAlert from './pages/prices/priceForm';
import FriendHomePage from './pages/amigos/friendHomepAge';
import SeeProfile from './pages/perfil/seeProfile';
import NewsTable from './pages/noticias/newsPage';
import APIPage from './pages/perfil/apiToken';
import CarteraPage from './pages/cartera/carteraMainPage';
import CarteraAlert from './pages/cartera/carteraAlert';
import SellBuy from './pages/compras/comprarVender';
import BotPage from './pages/bot/BotMainPage';
import Simulador from './pages/simulador/Simulador';

function AppRoutes() {
  // Ocultaremos el Nav en estas rutas:
  const location = useLocation();
  const noNavRoutes = [
    "/login",
    "/create-user",
    "/OTP-verification",
    "/reset-password",
    "/password/reset/confirm/:uid/:token",
    "/activate/:uid/:token",
  ];

  // Para rutas con params, checa solo el inicio:
  const hideNav = noNavRoutes.some((route) =>
    location.pathname.startsWith(route.split("/:")[0])
  );

  const isPublicPage = hideNav;

  if (isPublicPage) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-100 via-white to-slate-100">
        <Routes>

          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<CreateUserPage />} />
          <Route path="/OTP-verification" element={<OTPVerification />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordPageConfirm />} />
          <Route path="/activate/:uid/:token" element={<ActivationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {!hideNav && <Nav />}
      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/uploadVideo' element={<UploadVideoPage />} />
        <Route path='/videosMain' element={<UploadedVideosPage />} />
        <Route path='/sectionsPage' element={<VideosSectionPage />} />
        <Route path='/uploadSection' element={<UploadSection />} />
        <Route path='/deleteSection' element={<DeleteSection />} />
        <Route path='/notAcceptedVideos' element={<NotAcceptedVideosPage />} />
        <Route path='/perfilPage' element={<CreatePerfilPage />} />
        <Route path='/updatePerfil' element={<ActualizarPerfilPage />} />
        <Route path='/createQuiz' element={<CreateQuizPage />} />
        <Route path='/addQuestions' element={<AddQuestionsPage />} />
        <Route path='/renderQuiz' element={<RenderQuizPage />} />
        <Route path='/allQuizzes' element={<QuizThumbnails />} />
        <Route path='/answerQuiz' element={<RenderAnswerQuizPage />} />
        <Route path='/renderReports' element={<ReportThumbnails />} />
        <Route path='/updateQuestions' element={<UpdateQuestionsPage />} />
        <Route path='/inbox' element={<Message />}></Route>
        <Route path='/inbox/:id' element={<MessageDetail />}></Route>
        <Route path='/search/:username' element={<SearchUsers />}></Route>
        <Route path='/chooseCrypto' element={<ChooseCrypto />}></Route>
        <Route path='/graphPrediction' element={<GraphPrediction />}></Route>
        <Route path='/chooseCrypto10' element={<ChooseCrypto10 />}></Route>
        <Route path='/graphLast10Days' element={<GraphLast10Days />}></Route>
        <Route path='/seeTransactions' element={<SeeTransactions />}></Route>
        <Route path='/transactions' element={<TransactionsTable />}></Route>
        <Route path='/graphDates' element={<GraphDates />}></Route>
        <Route path='/grafica' element={<GenerateGraph />}></Route>
        <Route path='/priceAlert' element={<PriceAlert />}></Route>
        <Route path='/friends' element={<FriendHomePage />}></Route>
        <Route path='/seeProfile/:id' element={<SeeProfile />}></Route>
        <Route path='/news' element={<NewsTable />}></Route>
        <Route path='/API' element={<APIPage />}></Route>
        <Route path='/cartera' element={<CarteraPage />}></Route>
        <Route path="/cartera-alert/:crypto" element={<CarteraAlert />} />
        <Route path='/comprar' element={<SellBuy />}></Route>
        <Route path='/bot' element={<BotPage />}></Route>
        <Route path='/simulador' element={<Simulador />}></Route>
        <Route path='*' element={<NotFoundPage />}></Route>
      </Routes>
      <Toaster />
    </div>
  );
}

// Ahora usa este componente con BrowserRouter al tope:
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
