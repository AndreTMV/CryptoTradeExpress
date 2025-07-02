import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../app/store';
import Datepicker from "tailwind-datepicker-react";
import { createPriceAlert, reset } from '../../features/prices/priceSlice';
import { toast } from 'react-hot-toast';
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
const optionsInicio = {
	title: "Fecha Inicial",
	autoHide: true,
	todayBtn: false,
	clearBtn: true,
	clearBtnText: "Clear",
	maxDate: new Date("2027-01-01"),
	minDate: new Date(today),
	theme: {
		background: "bg-gray-700 dark:bg-gray-800",
		todayBtn: "",
		clearBtn: "",
		icons: "",
		text: "",
		disabledText: "bg-red-500",
		input: "",
		inputIcon: "",
		selected: "",
	},
	icons: {
		// () => ReactElement | JSX.Element
		prev: () => <span>Previous</span>,
		next: () => <span>Next</span>,
	},
	datepickerClassNames: "top-12",
	defaultDate: new Date(today),
	language: "es",
	disabledDates: [],
	weekDays: ["L", "Ma", "Mi", "J", "V", "S", "D"],
	inputNameProp: "date",
	inputIdProp: "date",
	inputPlaceholderProp: "Selecciona fecha",
	inputDateFormatProp: {
		day: "numeric",
		month: "long",
		year: "numeric"
	}
}
const optionsFinal = {
	title: "Fecha Final",
	autoHide: true,
	todayBtn: false,
	clearBtn: true,
	clearBtnText: "Clear",
	maxDate: new Date("2027-01-01"),
	minDate: new Date(today),
	theme: {
		background: "bg-gray-700 dark:bg-gray-800",
		todayBtn: "",
		clearBtn: "",
		icons: "",
		text: "",
		disabledText: "bg-red-500",
		input: "",
		inputIcon: "",
		selected: "",
	},
	icons: {
		// () => ReactElement | JSX.Element
		prev: () => <span>Previous</span>,
		next: () => <span>Next</span>,
	},
	datepickerClassNames: "top-12",
	defaultDate: new Date(today),
	language: "es",
	disabledDates: [],
	weekDays: ["L", "Ma", "Mi", "J", "V", "S", "D"],
	inputNameProp: "date",
	inputIdProp: "date",
	inputPlaceholderProp: "Selecciona Fecha",
	inputDateFormatProp: {
		day: "numeric",
		month: "long",
		year: "numeric"
	}
}

const CarteraAlert = () => {
  const { crypto } = useParams(); // Obtener el nombre de la criptomoneda desde la URL
  const [fechaInicial, setFetchaInicial] = useState<Date | null>(null);
  const [fechaFinal, setFetchaFinal] = useState<Date | null>(null);
  const [showInicio, setShowInicio] = useState<boolean>(false);
  const [showFinal, setShowFinal] = useState<boolean>(false);
  const [cryptoValue, setCryptoValue] = useState(crypto); // Establecer el valor inicial del select

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state: RootState) => state.auth)
  const { priceIsError, priceIsLoading, priceIsSuccess, priceMessage } = useSelector((state: RootState) => state.prices);
  const { predictionIsError, predictionIsSuccess, predictionIsLoading, predictionMessage, cryptos } = useSelector((state: RootState) => state.predictions);

  const [values, setValues] = useState({
    minPrice: 0.0,
    maxPrice: 0.0,
  });

  const { minPrice, maxPrice } = values;

  function handleChange(evt) {
    const { name, value } = evt.target;
    setValues(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  function formatDate(date: Date | null) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Agrega un cero inicial si el mes es de un solo dígito
    const day = String(date.getDate()).padStart(2, '0'); // Agrega un cero inicial si el día es de un solo dígito
    return `${year}-${month}-${day}`;
  }

  const handleChangeInicio = (selectedDate: Date) => {
    setFetchaInicial(selectedDate);
  };

  const handleChangeFinal = (selectedDate: Date) => {
    setFetchaFinal(selectedDate);
  };

  const handleCloseInicio = (state: boolean) => {
    setShowInicio(state);
  };

  const handleCloseFinal = (state: boolean) => {
    setShowFinal(state);
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const fechaFinalFormateada = formatDate(fechaFinal);
    const fechaInicialFormateada = formatDate(fechaInicial);
    const priceData = {
      user: userInfo.id,
      min_price: minPrice,
      max_price: maxPrice,
      min_date: fechaInicialFormateada,
      max_date: fechaFinalFormateada,
      cripto: cryptoValue
    }
    dispatch(createPriceAlert(priceData));
  }

  useEffect(() => {
    if (priceIsSuccess) {
      toast.success("Se te notificara por correo si se la cripto llega a estar en los rangos de precio ")
      navigate('/dashboard')
    } else if (priceIsError) {
      toast.error("Ha ocurrido un error:" + priceMessage)
    }

    return () => {
      reset()
    }
  }, [priceIsError, priceIsSuccess])

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-8 rounded shadow-md" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
          CryptoTradeExpress
        </h1>

        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            <Datepicker options={optionsInicio} onChange={handleChangeInicio} show={showInicio} setShow={handleCloseInicio} />
          </div>
          <span className="mx-4 text-gray-500">a</span>
          <div className="relative">
            <Datepicker options={optionsFinal} onChange={handleChangeFinal} show={showFinal} setShow={handleCloseFinal} />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor={minPrice} className="block mb-2 text-sm font-medium text-gray-900 ">Precio minimo</label>
          <input
            id="minPrice"
            name="minPrice"
            type="text"
            value={values.minPrice}
            onChange={handleChange}
            placeholder="Precio Minimo"
            className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor={maxPrice} className="block mb-2 text-sm font-medium text-gray-900 ">Precio maximo</label>
          <input
            id="maxPrice"
            name="maxPrice"
            type="text"
            value={values.maxPrice}
            onChange={handleChange}
            placeholder="Precio maximo"
            className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          id="section"
          name="section"
          value={cryptoValue}
          className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
          disabled // Deshabilitar el select
        >
          <option value={crypto}>{crypto}</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3"
        >
          Monitorear precio
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
          <Link to="/dashboard">Regresar</Link>
        </button>
      </form>
    </div>
  );
}

export default CarteraAlert;
