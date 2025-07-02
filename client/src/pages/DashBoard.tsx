import React, {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import {Link} from 'react-router-dom';
import { checkStaff, getUserInfo } from '../features/auth/authSlice';
import { getUserReports } from '../features/quiz/quizSlice';
import { RootState } from '../app/store'; 



const Dashboard = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [reportCount, setReportCount] = useState(0);



    const { userInfo, isStaff, isError, isLoading } = useSelector((state:RootState) => state.auth)
    const { quizIsError, quizIsSuccess, quizIsLoading, quizMessage, quiz } = useSelector((state: RootState) => state.quiz);
        
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserInfo())
    }, [])
    

    React.useEffect( () =>
    {
        dispatch(checkStaff({ username: userInfo.username}))
        dispatch( getUserReports( { username: userInfo.username } ) ).
        then( ( result ) =>
            {
        if (!result.payload || result.payload.length === 0) {
            setReportCount(0);
        } else {
            handleReportCount(result.payload);
        }
    });
    console.log(reportCount)
        
    },[dispatch, userInfo])

    useEffect(() => {
        const popupShown = localStorage.getItem('popupShown');
        if (!popupShown && reportCount > 0) {
            setShowPopup(true);
            localStorage.setItem('popupShown', 'true');
        }
    }, [reportCount]);

    const handleClosePopup = () => {
        setShowPopup(false);
    };


    const handleReportCount = (reports) => {
        setReportCount(reports.length);
    };

    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-4">¡Bienvenido, {userInfo.username}!</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <button className="btn text-white bg-indigo-300 rounded-md"><Link to={'/comprar'}>Comprar</Link></button>
                <button className="btn text-white bg-indigo-300 rounded-md"><Link to="/bot">Bot</Link></button>
                <button className="btn text-white bg-indigo-300 rounded-md"><Link to="/chooseCrypto10">Sugerencias</Link></button>
                <button className="btn text-white bg-indigo-300 rounded-md"><Link to={'/seeTransactions'}>Transacciones</Link></button>
                <button className="btn text-white bg-indigo-300 rounded-md"><Link to={'/graphDates'}>Gráficas</Link></button>
                <button className="btn text-white bg-indigo-300 rounded-md"><Link to={'/priceAlert'}>Alertas de precios</Link></button>
                <button className="btn text-white bg-indigo-300 rounded-md"><Link to="/chooseCrypto">Predicciones</Link></button>
                <button className="btn text-white bg-indigo-300 rounded-md"><Link to='/news'>Noticias</Link></button>
                <button className="btn text-white bg-indigo-300 rounded-md"><Link to="/inbox">Chat</Link></button>
                <button className="btn text-white bg-indigo-300 rounded-md"><Link to="/perfilPage">Perfil</Link></button>
                <button className="btn text-white bg-indigo-300 rounded-md"><Link to="/friends">Amigos</Link></button>
                <button className="btn text-white bg-indigo-300 rounded-md"><Link to="/sectionsPage">Video</Link></button>
                <button className="btn text-white bg-indigo-300 rounded-md"><Link to="/allQuizzes">Cuestionarios</Link></button>
                <button className="btn text-white bg-indigo-300 rounded-md"><Link to="/simulador">Simulador</Link></button>
                <button className="btn text-white bg-indigo-300 rounded-md">
                <Link to="/cartera">Cartera</Link>
                </button>
            </div>
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-8 rounded-md">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900">Reportes del Usuario</h2>
                        <p className="text-gray-900">{`El usuario tiene ${reportCount} reportes de cuestionarios pendientes.`}</p>
                        <button className="btn mt-4 text-gray-900" onClick={handleClosePopup}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
            </div>
        );

}

export default Dashboard