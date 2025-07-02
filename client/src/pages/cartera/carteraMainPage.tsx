import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getBinanceInfoUser, reset } from "../../features/cartera/carteraSlice";
import { checkKeys } from "../../features/perfil/perfilSlice";
import { RootState } from "../../app/store";

const CarteraPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {userInfo } = useSelector((state: RootState) => state.auth)
  const {perfilIsError, perfilIsLoading, perfilIsSuccess, perfilMessage } = useSelector((state: RootState) => state.perfil)
  const [info, setInfo] = useState({
    crypto_balances: {},
    crypto_predictions: {},
    crypto_values_in_usd: {},
  });

  useEffect(() => {
    const perfilData = {
        user: userInfo.id
    }
    dispatch(checkKeys(perfilData))
  }, []);
  
  useEffect(() => {
      if (!perfilMessage.exists) {
          toast.error('Tienes que conectarte con binance en el apartado de perfil')
          navigate('/dashboard')
      }

      else {
        const carteraData = {
          user: userInfo.id
        }
        try {
          dispatch(getBinanceInfoUser(carteraData)).then((response) => {
              if ( response )
              {
                  setInfo(response.payload)
                  console.log(response.payload)
              }
              
          }).catch((error) => {
              toast.error("Has introducido mal tus API keys intente de nuevo cerrando sesion")
              console.log(error)
          });         
        } catch (error) {
             toast.error("Has introducido mal tus API keys intente de nuevo cerrando sesion")         
             console.log(error)
        }
      }
  }, [perfilIsError, perfilIsSuccess, navigate, dispatch] )
    
    
    useEffect(() => {
        console.log(info)
    }, [info])

  const renderCryptoInfo = () => {
    if (!info.crypto_balances || !info.crypto_predictions || !info.crypto_values_in_usd) return null;
    let totalValueInUsd = 0;

    const cryptoCards = Object.keys(info.crypto_balances).map((key) => {
      const balance = info.crypto_balances[key];
      const prediction = info.crypto_predictions[key];
      const valueInUsd = info.crypto_values_in_usd[key];
      totalValueInUsd += valueInUsd;

      let colorClass = 'text-gray-400';
      let currentPrice = 1;
      let predictedPrice = 1;

      if (key !== 'USDT') {
        colorClass = prediction?.color === 'green' ? 'text-green-500' : 'text-red-500';
        currentPrice = prediction?.current_price?.toFixed(6);
        predictedPrice = prediction?.predicted_price?.toFixed(6);
      }

      return (
        <div key={key} className="bg-white shadow-md rounded-lg p-4 mb-4 w-full">
          <div className="flex justify-between items-center">
            <Link to={`/cartera-alert/${key}`} className={`text-xl font-semibold ${colorClass}`}>{key}</Link>
            {/* <h3 className={`text-xl font-semibold ${colorClass}`}>{key}</h3> */}
            <p className="text-gray-700">{balance}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-700">Precio actual: ${currentPrice}</p>
            <p className="text-gray-700">Precio estimado en 500 dias: ${predictedPrice}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-700">Valor en USD: ${valueInUsd.toFixed(2)}</p>
          </div>
        </div>
      );
    });

    return (
      <div className="w-full">
        {cryptoCards}
        <div className="bg-white shadow-md rounded-lg p-4 mt-4">
          <h3 className="text-xl font-semibold text-black">Valor total de tu cartera en USD</h3>
          <p className="text-gray-700">${totalValueInUsd.toFixed(2)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">CryptoTradeExpress</h1>
      <div className="flex flex-col items-center">
        {renderCryptoInfo()}
      </div>
      <div className="flex justify-center mt-6">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Link to="/dashboard">Regresar</Link>
        </button>
      </div>
    </div>
  );
};

export default CarteraPage;