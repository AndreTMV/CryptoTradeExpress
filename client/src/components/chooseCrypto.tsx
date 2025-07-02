import {  useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../app/store';
import { reset, getCryptos } from '../features/predictions/predictionsSlice';
import { toast } from 'react-hot-toast';

const chooseCrypto = () => {
    const [values, setValues] =useState({
        crypto:"",

    });
    const [cryptosList, setCryptos] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { predictionIsError, predictionIsSuccess, predictionIsLoading, predictionMessage, cryptos } = useSelector((state:RootState) => state.predictions);

    async function fetchCryptos() {
        try {
            const cryptosData = await dispatch(getCryptos());
            setCryptos(cryptosData.payload); 
        } catch (error) {
            console.error("Error fetching cryptos:", error);
        }
    }

    useEffect(() => {
        fetchCryptos()
    
      return () => {
        reset()
      }
    }, [])

    useEffect(() => {
        if (predictionIsError) {
        toast.error( predictionMessage);
            toast.error('Ha ocurrido un error, intentelo de nuevo.')
        }

        if (predictionIsSuccess) {

        }
        dispatch(reset())
    }, [ predictionIsError, predictionIsSuccess, predictionIsLoading, predictionMessage, navigate, dispatch])
    

    function handleChange(evt:any) {
        const { target } = evt;
        const { name, value } = target;
        const newValues = {
        ...values,
        [name]: value,
        };
        setValues(newValues);
    }
    function handleSubmit( evt: any )
    {
        evt.preventDefault()
        toast.success('Ok')
    }

    return (
        <div className="flex items-center justify-center h-screen">
          <form className="bg-white p-8 rounded shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
              CryptoTradeExpress
            </h1>

          <select
            id="section"
            name="section"
            value={values.crypto}
            onChange={handleChange}
            className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">Selecciona una crypto</option>
          {
            cryptosList.map( ( crypto ) => (
              <option key={crypto} value={crypto}>
                {crypto}
            </option>
            ))}
          </select>

            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmit}
            >
            Predecir precios
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
              <Link to="/dashboard">Regresar</Link>
            </button>
          </form>
        </div>
      );
}
 

export default chooseCrypto;