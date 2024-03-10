import React from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import {Link} from 'react-router-dom';
import { checkStaff } from '../features/auth/authSlice';


const Dashboard = () => {

    const { userInfo, isStaff, isError, isLoading } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    React.useEffect( () =>
    {
        dispatch(checkStaff({ username: userInfo.username}))
        
    },[])
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-4">¡Bienvenido, {userInfo.username}!</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <button className="btn text-white bg-indigo-300 rounded-md">Comprar</button>
                <button className="btn text-white bg-indigo-300 rounded-md">Bot</button>
                <button className="btn text-white bg-indigo-300 rounded-md">Sugerencias</button>
                <button className="btn text-white bg-indigo-300 rounded-md">Transacciones</button>
                <button className="btn text-white bg-indigo-300 rounded-md">Gráficas</button>
                <button className="btn text-white bg-indigo-300 rounded-md">Alertas de precios</button>
                <button className="btn text-white bg-indigo-300 rounded-md">Predicciones</button>
                <button className="btn text-white bg-indigo-300 rounded-md">Noticias</button>
                <button className="btn text-white bg-indigo-300 rounded-md">Chat</button>
                <button className="btn text-white bg-indigo-300 rounded-md"><Link to="/perfilPage">Perfil</Link></button>
                <button className="btn text-white bg-indigo-300 rounded-md">Amigos</button>
                <button className="btn text-white bg-indigo-300 rounded-md"><Link to="/sectionsPage">Video</Link></button>
                <button className="btn text-white bg-indigo-300 rounded-md">Cuestionarios</button>
                <button className="btn text-white bg-indigo-300 rounded-md">Simulador</button>
                <button className="btn text-white bg-indigo-300 rounded-md">Cartera</button>
                <button className="btn text-white bg-indigo-600 rounded-md">API</button>
            </div>
            </div>
        );

}

export default Dashboard