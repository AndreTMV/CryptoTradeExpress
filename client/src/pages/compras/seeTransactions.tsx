import React, {useEffect, useState} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransacciones, reset } from '../../features/compras/comprasSlice';
import { RootState } from '../../app/store';
import { toast } from 'react-hot-toast';
import Spinner from "../../components/Spinner";

const TransactionsTable = () =>
{
    const dispatch = useDispatch()
    const location = useLocation()
    const {state} = location 
    var {fechaInicial, fechaFinal} = state || {}
    const [transactions, setTransactions] = useState([])

    const { compras, comprasIsError, comprasIsMessage, comprasIsLoading, comprasIsSuccess } = useSelector( ( state: RootState ) => state.compras );
    const {userInfo} = useSelector((state:RootState) => state.auth)
    const userId = userInfo.id;

    function formatDate(date:Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Agrega un cero inicial si el mes es de un solo dígito
        const day = String(date.getDate()).padStart(2, '0'); // Agrega un cero inicial si el día es de un solo dígito
        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        const fechaFinalFormateada = formatDate(fechaFinal);
        const fechaInicialFormateada = formatDate(fechaInicial);
        const comprasData = {
            fechaFinal:fechaFinalFormateada,
            fechaInicial:fechaInicialFormateada,
            userId
        }
        console.log(comprasData)
        dispatch( fetchTransacciones( comprasData ) )
            .then( ( response ) =>
            {
                if ( response.payload )
                {
                    console.log(response.payload)
                    setTransactions( response.payload );
                } else
                {
                    toast.error("Error haciendo la solicitud al servidor")
                }
            
            }).catch((error) => {
                console.error("Error fetching plot:", error);
                toast.error('Ha ocurrido un error al cargar los datos');
            });
    
      return () => {
          reset();
      }
    }, [fechaFinal, fechaInicial])

    useEffect(() => {
        console.log(transactions)
    
      return () => {
      }
    }, [transactions])
    
    
    return (
        <div className="container mx-auto">
           <div className="text-center"> 
                <h2 className="text-2xl font-bold my-4">Transacciones</h2>
            </div>
            {comprasIsLoading ? (
                <div className="flex-grow">
                    <p>Cargando Informacion</p>
                    <Spinner></Spinner>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fecha Compra</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Precio de Compra</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Criptomoneda Comprada</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fecha Venta</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Precio de Venta</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Criptomoneda Vendida</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ganancia</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {transactions.map((transaction, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{new Date(transaction.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{transaction.buying_price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{transaction.venta__compra__criptomoneda_bought}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{new Date(transaction.venta__date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{transaction.venta__selling_price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{transaction.venta__criptomoneda_sold}</td>
                                <td className={`px-6 py-4 whitespace-nowrap ${transaction.ganancia >= 0 ? 'text-green-600' : 'text-red-600'}`}>{transaction.ganancia}</td>
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

export default TransactionsTable;