import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {Navigation} from './components/Navigation'
import {LoginPage} from './pages/loginPage'
import { CreateUserPage } from './pages/createUserPage';
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
        </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App