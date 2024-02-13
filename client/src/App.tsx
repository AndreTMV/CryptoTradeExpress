import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {Navigation} from './components/Navigation'
import {LoginPage} from './pages/loginPage'
import { CreateUserPage } from './pages/createUserPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ActivationPage } from './pages/ActivatePage';
import {Toaster} from 'react-hot-toast'
function App()
{
  return (
    <BrowserRouter>
    <div className="container mx-auto">
       <Routes>
          <Route path="/" element={<Navigation />} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/create-user" element={<CreateUserPage/>} />
          <Route path="/account-activate" element={<ActivationPage/>} />
          <Route path="/reset-password" element={<ResetPasswordPage/>} />
        </Routes>
        <Toaster/>
    </div>
    </BrowserRouter>
  )
}

export default App