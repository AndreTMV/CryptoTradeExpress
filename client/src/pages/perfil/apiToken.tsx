import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import {setKeys, reset} from '../../features/perfil/perfilSlice';
import { toast } from 'react-hot-toast';
import { RootState } from '../../app/store';

const  APIPage = () => {
  const [values, setValues] = useState({
    api_key: "",
    secret_key: "",
  });
  const { api_key, secret_key } = values;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { perfilIsError, perfilIsLoading, perfilIsSuccess, perfilMessage } = useSelector( ( state: RootState ) => state.perfil );



  function handleSubmit(evt) {
    evt.preventDefault();
    const userData = {
      user: userInfo.id,
      key: api_key,
      secret: secret_key,
    };
    dispatch(setKeys(userData));
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setValues(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  useEffect(() => {
    if (perfilIsError) {
      toast.error(perfilMessage)
    }

    if (perfilIsSuccess && !perfilIsLoading) {
      toast.success("Se ha configurado tus keys")
      navigate( "/dashboard")
    }

    return () =>
    {
      dispatch(reset())
    }
  }, [perfilIsError, perfilIsSuccess, perfilIsLoading]);

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
          CryptoTradeExpress
        </h1>
        <input
          id="api_key"
          name="api_key"
          type="text"
          value={api_key}
          onChange={handleChange}
          placeholder="API KEY"
          className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
        />
        <input
          id="secret_key"
          name="secret_key"
          type="password"
          value={secret_key}
          onChange={handleChange}
          placeholder="SECRET KEY"
          className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
        />

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSubmit}
          >
            Activar API
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
            <Link to="/perfilPage">Regresar</Link>
          </button>
        </div>
        <a
            href="https://www.binance.com/es/support/faq/cómo-crear-claves-api-en-binance-360002502072"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm mb-4 block"
        >
            ¿No sabes como conectarte con binance?
        </a>
      </form>

    </div>
  );
}

export default APIPage;

