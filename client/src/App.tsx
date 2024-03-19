import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Navigation} from './components/Navigation'
import QuizResult from './components/answerQuiz'
import {LoginPage} from './pages/login/loginPage'
import { CreateUserPage } from './pages/login/createUserPage';
import Dashboard from './pages/DashBoard';
import { ResetPasswordPage } from './pages/login/ResetPasswordPage';
import { ActivationPage } from './pages/login/ActivatePage';
import NotFoundPage  from './pages/login/NotFoundPage';
import { ResetPasswordPageConfirm } from './pages/login/ResetPasswordConfirmPage';
import {Toaster} from 'react-hot-toast'
import Nav from "./components/Nav"
import { OTPVerification } from './pages/login/OTPVerification';
import  UploadedVideosPage    from './pages/videos/videoMain';
import { UploadVideoPage } from './pages/videos/uploadVideoForm';
import VideosSectionPage from './pages/videos/videosSection';
import { UploadSection } from './pages/videos/uploadSection';
import { DeleteSection } from './pages/videos/deleteSection';
import  NotAcceptedVideosPage from './pages/videos/noAcceptedVideos';
import { CreatePerfilPage } from './pages/perfil/createPerfilForm';
import { CreateQuizPage } from './pages/quiz/createQuizForm';
import { AddQuestionsPage } from './pages/quiz/addQuestionsForm';
import  RenderQuizPage  from './pages/quiz/renderQuizPage';
import  QuizThumbnails  from './pages/quiz/renderAllQuizes';
import  RenderAnswerQuizPage  from './pages/quiz/renderAnswerQuizPage';
import  ReportThumbnails  from './pages/quiz/renderReport';
import { UpdateQuestionsPage } from './pages/quiz/updateQuestionsForm';
import Message from './pages/chat/message'
import MessageDetail from './pages/chat/messageDetail'
import SearchUsers from './pages/chat/searchUsers'
function App()
{
  return (
    <BrowserRouter>
    <div className="container mx-auto">
      <Nav />
       <Routes>
          <Route path="/" element={<Navigation />} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/create-user" element={<CreateUserPage/>} />
          <Route path="/activate/:uid/:token" element={<ActivationPage/>} />
          <Route path="/reset-password" element={<ResetPasswordPage/>} />
          <Route path="/password/reset/confirm/:uid/:token" element={<ResetPasswordPageConfirm />} />
          <Route path='/OTP-verification' element={<OTPVerification/>}/>
          <Route path='/uploadVideo' element={<UploadVideoPage/>}/>
          <Route path='/videosMain' element={<UploadedVideosPage/>}/>
          <Route path='/sectionsPage' element={<VideosSectionPage/>}/>
          <Route path='/uploadSection' element={<UploadSection/>}/>
          <Route path='/deleteSection' element={<DeleteSection/>}/>
          <Route path='/notAcceptedVideos' element={<NotAcceptedVideosPage/>}/>
          <Route path='/perfilPage' element={<CreatePerfilPage/>}/>
          <Route path='/createQuiz' element={<CreateQuizPage/>}/>
          <Route path='/addQuestions' element={<AddQuestionsPage/>}/>
          <Route path='/renderQuiz' element={<RenderQuizPage/>}/>
          <Route path='/allQuizzes' element={<QuizThumbnails/>}/>
          <Route path='/answerQuiz' element={<RenderAnswerQuizPage/>}/>
          <Route path='/renderReports' element={<ReportThumbnails/>}/>
          <Route path='/updateQuestions' element={<UpdateQuestionsPage/>}/>
          <Route path='/inbox' element={<Message/>}></Route>
          <Route path='/inbox/:id' element={<MessageDetail/>}></Route>
          <Route path='/search/:username' element={<SearchUsers/>}></Route>
          <Route path='*' element={<NotFoundPage/>}></Route>
        </Routes>
        <Toaster/>
    </div>
    </BrowserRouter>
  )
}

export default App