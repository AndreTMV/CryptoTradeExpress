import {  useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../app/store';
import { reset, getCryptos } from '../../features/predictions/predictionsSlice';
import { toast } from 'react-hot-toast';

const ChooseCrypto10 = () => {
    const [crypto, setCrypto] = useState(""); // Cambiado de values a crypto
    const [cryptosList, setCryptos] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { predictionIsError, predictionIsSuccess, predictionIsLoading, predictionMessage, cryptos } = useSelector((state:RootState) => state.predictions);

    async function fetchCryptos() {
        try {
            const cryptosData = await dispatch(getCryptos());
            console.log(cryptosData.payload.cryptos);
            await setCryptos(cryptosData.payload.cryptos); 
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
        if (cryptosList.length > 0) {
            console.log(cryptosList);
        }
    }, [cryptosList]);

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
        const { value } = evt.target;
        setCrypto(value);
    }

    function handleSubmit( evt: any )
    {
        evt.preventDefault()
        navigate( '/graphLast10Days', {
          state: {crypto}
        } )
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
            value={crypto}
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
            Ver precios 
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
              <Link to="/dashboard">Regresar</Link>
            </button>
          </form>
        </div>
      );
}
 

export default ChooseCrypto10;