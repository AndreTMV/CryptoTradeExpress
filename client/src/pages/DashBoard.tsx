import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { checkStaff, getUserInfo } from '../features/auth/authSlice';
import { getUserReports } from '../features/quiz/quizSlice';
import { RootState, AppDispatch } from '../app/store';
import {
  HiOutlineShoppingCart, HiOutlineUserGroup, HiOutlineChatBubbleBottomCenter, HiOutlineBell,
  HiOutlineCurrencyDollar, HiOutlineChartBar, HiOutlineUserCircle, HiOutlineNewspaper,
  HiOutlineVideoCamera, HiOutlineClipboardDocument, HiOutlineShieldCheck,
  HiOutlineCalculator, HiOutlineArrowTrendingUp
} from 'react-icons/hi2';

interface DashboardButton {
  label: string;
  to: string;
  icon: React.ReactElement;
  color: string;
}

const DASHBOARD_BUTTONS: DashboardButton[] = [
  { label: 'Comprar', to: '/comprar', icon: <HiOutlineShoppingCart size={32} />, color: 'bg-blue-500' },
  { label: 'Bot', to: '/bot', icon: <HiOutlineShieldCheck size={32} />, color: 'bg-emerald-500' },
  { label: 'Sugerencias', to: '/chooseCrypto10', icon: <HiOutlineBell size={32} />, color: 'bg-violet-500' },
  { label: 'Transacciones', to: '/seeTransactions', icon: <HiOutlineCurrencyDollar size={32} />, color: 'bg-yellow-500' },
  { label: 'Gráficas', to: '/graphDates', icon: <HiOutlineChartBar size={32} />, color: 'bg-pink-500' },
  { label: 'Alertas de precios', to: '/priceAlert', icon: <HiOutlineArrowTrendingUp size={32} />, color: 'bg-orange-500' },
  { label: 'Predicciones', to: '/chooseCrypto', icon: <HiOutlineClipboardDocument size={32} />, color: 'bg-blue-600' },
  { label: 'Noticias', to: '/news', icon: <HiOutlineNewspaper size={32} />, color: 'bg-amber-600' },
  { label: 'Chat', to: '/inbox', icon: <HiOutlineChatBubbleBottomCenter size={32} />, color: 'bg-lime-600' },
  { label: 'Perfil', to: '/perfilPage', icon: <HiOutlineUserCircle size={32} />, color: 'bg-cyan-600' },
  { label: 'Amigos', to: '/friends', icon: <HiOutlineUserGroup size={32} />, color: 'bg-green-700' },
  { label: 'Videos', to: '/sectionsPage', icon: <HiOutlineVideoCamera size={32} />, color: 'bg-indigo-600' },
  { label: 'Cuestionarios', to: '/allQuizzes', icon: <HiOutlineClipboardDocument size={32} />, color: 'bg-purple-700' },
  { label: 'Simulador', to: '/simulador', icon: <HiOutlineCalculator size={32} />, color: 'bg-fuchsia-600' },
  { label: 'Cartera', to: '/cartera', icon: <HiOutlineCurrencyDollar size={32} />, color: 'bg-teal-600' },
];

const Dashboard: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [reportCount, setReportCount] = useState(0);

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  useEffect(() => {
    if (!userInfo?.username) return;
    dispatch(checkStaff({ username: userInfo.username }));
    dispatch(getUserReports(userInfo.username))
      .then((result: any) => {
        setReportCount(result.payload?.length ?? 0);
      });
  }, [dispatch, userInfo?.username]);

  useEffect(() => {
    const popupShown = localStorage.getItem('popupShown');
    if (!popupShown && reportCount > 0) {
      setShowPopup(true);
      localStorage.setItem('popupShown', 'true');
    }
  }, [reportCount]);

  const handleClosePopup = useCallback(() => {
    setShowPopup(false);
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="mb-8 text-center text-4xl font-extrabold text-indigo-900 drop-shadow">
          ¡Bienvenido, <span className="text-blue-600">{userInfo?.username ?? 'Usuario'}</span>!
        </h1>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {DASHBOARD_BUTTONS.map((btn) => (
            <Link to={btn.to} key={btn.label} className="w-full">
              <div className={`flex flex-col items-center justify-center rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl ${btn.color} min-h-[100px] min-w-[180px] px-8 py-6`}>
                <span className="mb-2">{btn.icon}</span>
                <span className="text-lg font-semibold text-white">{btn.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {showPopup && (
        <div className="animate-fadein fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-60 transition-all">
          <div className="animate-popup mx-2 flex w-full max-w-sm flex-col items-center rounded-2xl bg-white px-8 py-6 shadow-2xl md:px-12 md:py-10">
            <h2 className="mb-3 text-xl font-bold text-blue-700">¡Tienes reportes pendientes!</h2>
            <p className="mb-2 text-gray-800">{`Tienes ${reportCount} reportes de cuestionarios por revisar.`}</p>
            <button
              className="mt-4 rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white transition hover:bg-blue-700"
              onClick={handleClosePopup}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      <style>
        {`
          .animate-fadein { animation: fadein .4s; }
          .animate-popup { animation: popup .3s; }
          @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
          @keyframes popup { from { transform: scale(.85); opacity:0 } to { transform: scale(1); opacity: 1 } }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
