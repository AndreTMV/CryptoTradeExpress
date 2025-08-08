import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import NotificationBell from './notification';
import { IoIosLogOut } from "react-icons/io";
import { RootState } from '../app/store';

const Nav: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userState, logoutState, isStaff, userInfo } = useSelector((state: RootState) => state.auth);
  const { notificationCount } = useSelector((state: RootState) => state.notifications);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    localStorage.removeItem('popupShown');
    navigate("/");
  };

  return (
    <nav className="fixed left-0 top-0 z-50 w-screen bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 shadow-lg">
      <div className="flex h-16 items-center justify-between px-4 md:px-12 lg:px-32">
        <div className="flex items-center space-x-3">
          <img
            src="/logo192.png"
            alt="Logo"
            className="size-9 rounded-full bg-white p-1 shadow-md"
          />
          <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow md:text-3xl">
            CryptoTradeExpress
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {userState && (
            <span className="hidden px-3 text-lg font-medium text-indigo-200 md:inline-block">
              {userInfo?.username}
            </span>
          )}
          {isStaff && (
            <div className="relative">
              <NotificationBell notificationCount={notificationCount} />
            </div>
          )}
          {userState && (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 rounded-2xl bg-red-600 px-4 py-2 font-bold text-white shadow transition-all hover:bg-red-700 focus:outline-none"
              title="Cerrar sesión"
            >
              <IoIosLogOut size={22} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          )}
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-800"></div>
    </nav>
  );
};

export default Nav;
