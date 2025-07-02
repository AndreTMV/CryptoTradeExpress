import {  useState, useEffect} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../app/store';
import {reset , graphTwo, fetchTransacciones} from '../../features/compras/comprasSlice'
import { toast } from 'react-hot-toast';
import Plot from 'react-plotly.js';
import Spinner from "../../components/Spinner";
import moment from 'moment';



const GenerateGraph = () => {
    let [plotData, setPlot] = useState({})
    const [transactions, setTransactions] = useState([])
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); 
    var {fechaInicial, fechaFinal, tipoGrafica} = location.state || {}
    const { predictionIsError, predictionIsSuccess, predictionIsLoading, predictionMessage, cryptos } = useSelector((state:RootState) => state.predictions);
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
        console.log(tipoGrafica)
        if ( tipoGrafica === "graphOne" )
        {
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
        } else if ( tipoGrafica === "graphTwo" )
        {
            dispatch( graphTwo( comprasData ) )
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
        }

    
      return () => {
          reset();
      }
    }, [fechaFinal, fechaInicial])

    useEffect(() => {
        if (predictionIsError) {
        toast.error( predictionMessage);
            toast.error('Ha ocurrido un error, intentelo de nuevo.')
        }

        if (predictionIsSuccess) {

        }
        dispatch(reset())
    }, [predictionIsError, predictionIsSuccess, predictionIsLoading, predictionMessage, navigate, dispatch] )

    useEffect( () =>
    {
        if ( tipoGrafica === "graphOne" )
        {
            if (transactions.length > 0) {
                const data = transactions.map((transaction) => ({
                    x: [transaction.venta__date],
                    y: [transaction.ganancia],
                    type: "bar",
                }));
            setPlot({ data });
            } 
        } else if ( tipoGrafica === "graphTwo" )
        {
            if (transactions.length > 0) {
                const data = transactions.map((transaction) => ({
                    x: [transaction.month],
                    y: [transaction.ganancia_total],
                    type: "bar",
                }));
            setPlot({ data });
            } 
        }
        
  }, [transactions]);
    console.log(plotData)

    return (
        <div className='content flex flex-col items-center justify-center h-screen'>
            <h1 className="text-3xl font-bold mb-6 text-center">Transacciones</h1>
            <div className="flex-grow">
            {plotData && plotData.data ? (
                <Plot
                data={plotData.data}
                layout={{
                    width: plotData.width,
                    height: plotData.height,
                    title: {
                        text: "Ganancia por Fecha de transaccion" 
                    },
                    xaxis: {
                        title: {
                            text: "Fecha de transaccion" 
                        }
                    },
                    yaxis: {
                        title: {
                            text: "Ganancia" 
                        }
                    }
                }}
                /> ) :
                <div className="flex-grow">
                    <p>Cargando Informacion</p>
                    <Spinner></Spinner>
                </div>
                }
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ">
              <Link to="/dashboard">Regresar</Link>
            </button>
        </div>
    );
}
 

export default GenerateGraph;


