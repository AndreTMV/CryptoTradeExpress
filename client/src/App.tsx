import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {Navigation} from './components/Navigation'
import {LoginPage} from './pages/loginPage'
import { CreateUserPage } from './pages/createUserPage';
import Dashboard from './pages/DashBoard';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ActivationPage } from './pages/ActivatePage';
import NotFoundPage  from './pages/NotFoundPage';
import { ResetPasswordPageConfirm } from './pages/ResetPasswordConfirmPage';
import {Toaster} from 'react-hot-toast'
import Nav from "./components/Nav"
import { OTPVerification } from './pages/OTPVerification';

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
          <Route path='*' element={<NotFoundPage/>}></Route>
        </Routes>
        <Toaster/>
    </div>
    </BrowserRouter>
  )
}

export default App