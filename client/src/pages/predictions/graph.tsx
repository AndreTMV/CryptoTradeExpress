import {  useState, useEffect} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../app/store';
import { reset, graphPrediction } from '../../features/predictions/predictionsSlice';
import { toast } from 'react-hot-toast';
import Plot from 'react-plotly.js';
import Spinner from "../../components/Spinner";



const GraphPrediction = () => {
    const [plotData, setPlot] = useState({})
    const [mounted, setMounted] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); 
    const crypto = location.state?.crypto
    const { predictionIsError, predictionIsSuccess, predictionIsLoading, predictionMessage, cryptos } = useSelector((state:RootState) => state.predictions);
    console.log(crypto)

    useEffect(() => {
        if (crypto) {
            dispatch(graphPrediction({ crypto }))
                .then((response) => {
                    if (response.payload) {
                        setPlot(response.payload);
                    } else {
                        toast.error('No se encontraron datos para la predicción');
                    }
                })
                .catch((error) => {
                    console.error("Error fetching plot:", error);
                    toast.error('Ha ocurrido un error al cargar los datos');
                });
        }
    }, [crypto, dispatch]);



    useEffect(() => {
        if (plotData) {
            console.log(plotData);
        }
    }, [plotData]);

    useEffect(() => {
        if (predictionIsError) {
        toast.error( predictionMessage);
            toast.error('Ha ocurrido un error, intentelo de nuevo.')
        }

        if (predictionIsSuccess) {

        }
        dispatch(reset())
    }, [ predictionIsError, predictionIsSuccess, predictionIsLoading, predictionMessage, navigate, dispatch])
    console.log(plotData);



    return (
        <div className='content flex flex-col items-center justify-center h-screen'>
            <h1 className="text-3xl font-bold mb-6 text-center">Prediccion de {crypto }</h1>
            <div className="flex-grow">

            {plotData && plotData.data  ?  (<Plot
                data={[
                    {
                        x: plotData.data.data01.map( point => point[0] ),
                        y: plotData.data.data01.map( point => point[1] ), // Precio de cierre
                        type: 'scatter',
                        mode: 'lines',
                        name: 'Regresion Lineal',
                        line: {
                            color: 'blue',
                            width: 3
                        }
                    },
                    {
                        x: plotData.data.data02.map( point => point[0] ),
                        y: plotData.data.data02.map( point => point[1] ), // Precio de cierre del día siguiente (predicción)
                        type: 'scatter',
                        mode: 'markers',
                        name: 'Precio de cierre de los ultimos 500 dias',
                        line: {
                            color: '#87CEFA',
                            width: 1
                        }

                    },
                    {
                        x: plotData.data.data03.map( point => point[0] ),
                        y: plotData.data.data03.map( point => point[1] ), // Precio de cierre del día siguiente (predicción)
                        type: 'scatter',
                        mode: 'markers',
                        name: 'Precio de cierre de los proximos 500 dias',
                        line: {
                            color: '#4682B4',
                            width: 1
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
              <Link to="/chooseCrypto">Regresar</Link>
            </button>
        </div>
    );
}
 

export default GraphPrediction;
