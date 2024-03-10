import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createPerfil, reset } from "../../features/perfil/perfilSlice";

export function CreatePerfilPage() {
  const [values, setValues] = React.useState({
    name: "",
    description: "",
    interested_cryptos: [],
    date_joined:""
  });

  const { name, description, interested_cryptos, date_joined } = values;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {userInfo } = useSelector((state) => state.auth)
  const {perfilIsError, perfilIsLoading, perfilIsSuccess, perfilMessage } = useSelector((state) => state.perfil)

  function handleSubmit( evt: any )
  {
    evt.preventDefault()
    const currentDate: Date = new Date();

    const perfilData = {
        username:userInfo.id,
        name,
        description,
        interested_cryptos,
        date_joined:currentDate
    }
    dispatch(createPerfil(perfilData))

  }

  function handleChange(evt:any) {
    
    const { target } = evt;
    const { name, value } = target;
    const newValue = name === 'interested_cryptos' ? value.split(',') : value;

    const newValues = {
      ...values,
      [name]: newValue,
    };
    setValues(newValues);
  }

  React.useEffect(() => {
      if (perfilIsError) {
        toast.error(perfilMessage);
          toast.error('Ha ocurrido un error, intentelo de nuevo.')
      }

      if (perfilIsSuccess) {
          navigate("/dashboard")
          toast.success("Se ha modificado la informacion de tu perfil")
      }
      dispatch(reset())
  }, [perfilIsError,perfilIsLoading,perfilIsSuccess, perfilMessage, navigate, dispatch])


  return (
    <div className="flex items-center justify-center h-screen">
          <form className="bg-white p-8 rounded shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
              CryptoTradeExpress
            </h1>
            <input
              id="name"
              name="name"
              type="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Nombre"
              className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              id="description"
              name="description"
              type="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Description"
              className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              id="interested_cryptos"
              name="interested_cryptos"
              type="interested_cryptos"
              value={values.interested_cryptos}
              onChange={handleChange}
              placeholder="Cryptos de interes"
              className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmit}
            >
            Modificar
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
              <Link to="/dashboard">Regresar</Link>
            </button>
          </form>
        </div>
  );
}