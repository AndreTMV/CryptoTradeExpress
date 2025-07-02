import {  useState, useEffect} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../app/store';
import { reset, graphLast10Days } from '../../features/predictions/predictionsSlice';
import { toast } from 'react-hot-toast';
import Plot from 'react-plotly.js';
import Spinner from "../../components/Spinner";
import moment from 'moment';



const GraphLast10Days = () => {
    let [plotData, setPlot] = useState({})
    let [days, setDays] = useState([])
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); 
    const crypto = location.state?.crypto
    const { predictionIsError, predictionIsSuccess, predictionIsLoading, predictionMessage, cryptos } = useSelector((state:RootState) => state.predictions);
    console.log(crypto)


    useEffect(() => {
        if (crypto) {
            dispatch(graphLast10Days({ crypto }))
                .then((response) => {
                    if (response.payload) {
                        setPlot( response.payload )
                    } else {
                        toast.error('No se encontraron datos para esa criptomoneda');
                    }
                })
                .catch((error) => {
                    console.error("Error fetching plot:", error);
                    toast.error('Ha ocurrido un error al cargar los datos');
                });
        }
    }, [crypto, dispatch]);

    useEffect(() => {
        if (predictionIsError) {
        toast.error( predictionMessage);
            toast.error('Ha ocurrido un error, intentelo de nuevo.')
        }

        if (predictionIsSuccess) {

        }
        dispatch(reset())
    }, [ predictionIsError, predictionIsSuccess, predictionIsLoading, predictionMessage, navigate, dispatch])

    console.log(plotData)
    console.log(days)
    



    return (
        <div className='content flex flex-col items-center justify-center h-screen'>
            <h1 className="text-3xl font-bold mb-6 text-center">Precios de {crypto }</h1>
            <div className="flex-grow">

            {plotData && plotData.data  ?  (<Plot
                data={[
                    {
                        x: plotData.data.data01.map(point => point[0]),
                        y: plotData.data.data01.map( point => point[1] ), 
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Precio de los ultimos dias',
                        line: {
                            color: 'blue',
                            width: 3
                        }
                    }
                    
                ]}
                layout={{
                    width: plotData.width,
                    height: plotData.height,
                    title: {
                        text: plotData.axes[0].texts[2].text
                    },
                    xaxis: {
                        title: {
                            text: plotData.axes[0].texts[0].text
                        }
                    },
                    yaxis: {
                        title: {
                            text: plotData.axes[0].texts[1].text
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
              <Link to="/chooseCrypto10">Regresar</Link>
            </button>
        </div>
    );
}
 

export default GraphLast10Days;

