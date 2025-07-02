import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { fetchNews, reset } from '../../features/noticias/noticiaSlice';
import { RootState } from '../../app/store';
import { toast } from 'react-hot-toast';
import Spinner from "../../components/Spinner";

const NewsTable = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [newsInfo, setNews] = useState([])

    const { news } = useSelector( ( state: RootState ) => state.news );

    useEffect(() => {
    dispatch( fetchNews() )
        .then( ( response ) => {
            if ( response )
            {
                setNews(response.payload)
            } else
            {
                toast.error("Error haciendo la solicitud al servidor")
            }
        
        }).catch((error) => {
            console.error("Error fetching plot:", error);
            toast.error('Ha ocurrido un error al cargar los datos');
        });
    
      return () => {
        reset()
      }
    }, [])

    useEffect(() => {
        console.log(newsInfo)
    
    }, [newsInfo])
    return (
        <div className="container mx-auto">
            <div className="text-center"> 
                <h2 className="text-2xl font-bold my-4">Noticias</h2>
            </div>
            {news.length === 0 ? (
                <div className="flex-grow">
                    <p>Cargando Información</p>
                    <Spinner></Spinner>
                </div>
            ) : (
                <div>
                    <table className="min-w-full divide-y divide-gray-200 mb-4">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cripto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Noticia</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {newsInfo.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.user}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.crypto}</td>
                                    <td className={`px-6 py-4 whitespace-wrap text-gray-700 ${item.compound >= 0.8 ? 'text-green-600' : item.compound >= 0.6 ? 'text-green-500' : item.compound >= 0.4 ? 'text-green-400' : item.compound >= 0.2 ? 'text-green-300' : item.compound >= 0 ? 'text-green-200' : item.compound >= -0.19 ? 'text-red-200' : item.compound >= -0.39 ? 'text-red-300' : item.compound >= -0.59 ? 'text-red-400' : item.compound >= -0.79 ? 'text-red-500' : 'text-red-600'}`}>{item.news}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-2">Significado de los colores:</h3>
                        <table className="border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2">Posible impacto en valor de criptomoneda</th>
                                    <th className="px-4 py-2">Color de Texto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                        <td className="px-4 py-2">impacto excelente</td>
                                    <td className="px-4 py-2 text-green-600">Verde oscuro</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">impacto muy bueno</td>
                                    <td className="px-4 py-2 text-green-500">Verde medio</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">impacto bueno</td>
                                    <td className="px-4 py-2 text-green-400">Verde claro</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">impacto poco bueno</td>
                                    <td className="px-4 py-2 text-green-300">Verde muy claro</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">impacto pobremente bueno</td>
                                    <td className="px-4 py-2 text-green-200">Verde muy claro</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">impacto negativo muy leve</td>
                                    <td className="px-4 py-2 text-red-200">Rojo muy claro</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">impacto negativo leve</td>
                                    <td className="px-4 py-2 text-red-300">Rojo claro</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">impacto negativo alto</td>
                                    <td className="px-4 py-2 text-red-400">Rojo medio</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">impacto negativo muy alto</td>
                                    <td className="px-4 py-2 text-red-500">Rojo oscuro</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">impacto negativo demasiado alto</td>
                                    <td className="px-4 py-2 text-red-600">Rojo muy oscuro</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <div className="text-center"> 
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                    <Link to="/dashboard">Regresar</Link>
                </button>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto">
        <div className="text-center"> 
                <h2 className="text-2xl font-bold my-4">Noticias</h2>
            </div>
            {news.length === 0 ? (
                <div className="flex-grow">
                    <p>Cargando Informacion</p>
                    <Spinner></Spinner>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cripto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Noticia</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {newsInfo.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{new Date(item.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.user}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.crypto}</td>
                                <td className={`px-6 py-4 whitespace-wrap text-gray-700 ${item.compound >= 0.8 ? 'text-green-600' : item.compound >= 0.6 ? 'text-green-500' : item.compound >= 0.4 ? 'text-green-400' : item.compound >= 0.2 ? 'text-green-300' : item.compound >= 0 ? 'text-green-200' : item.compound >= -0.19 ? 'text-red-200' : item.compound >= -0.39 ? 'text-red-300' : item.compound >= -0.59 ? 'text-red-400' : item.compound >= -0.79 ? 'text-red-500' : 'text-red-600'}`}>{item.news}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        <div className="text-center"> 
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                    <Link to="/dashboard">Regresar</Link>
                </button>
            </div>
        </div>
    );
}

export default NewsTable