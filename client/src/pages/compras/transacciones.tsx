import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../app/store';
import Datepicker from "tailwind-datepicker-react"
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
	minDate: new Date("2023-01-01"),
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
	minDate: new Date("2023-01-01"),
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
const SeeTransactions = () =>
{
	const [fechaInicial, setFetchaInicial] = useState<Date | null>(null);
	const [fechaFinal, setFetchaFinal] = useState<Date | null>(null);
	const [showInicio, setShowInicio] = useState<boolean>(false);
	const [showFinal, setShowFinal] = useState<boolean>(false);
	const navigate= useNavigate();



	const handleChangeInicio = (selectedDate: Date) => {
		setFetchaInicial(selectedDate);
		console.log(selectedDate);
	};

	const handleChangeFinal = (selectedDate: Date) => {
		setFetchaFinal(selectedDate);
		console.log(selectedDate);
	};

	const handleCloseInicio = (state: boolean) => {
		setShowInicio(state);
	};

	const handleCloseFinal = (state: boolean) => {
		setShowFinal(state);
	};

	const handleSubmit = (evt:React.FormEvent<HTMLFormElement>) =>
	{
		evt.preventDefault();
		navigate( '/transactions', {
			state: {
				fechaFinal,
				fechaInicial
			}
		})


	}

   return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
          CryptoTradeExpress
        </h1>

        <div className="flex items-center">
          <div className="relative">
			  <Datepicker options={optionsInicio} onChange={handleChangeInicio} show={showInicio} setShow={handleCloseInicio} />
          </div>
          <span className="mx-4 text-gray-500">a</span>
          <div className="relative">
              <Datepicker options={optionsFinal} onChange={handleChangeFinal} show={showFinal} setShow={handleCloseFinal} />
          </div>
        </div>

        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3"
		  onClick={handleSubmit}
        >
          Ver Transacciones
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
          <Link to="/dashboard">Regresar</Link>
        </button>
      </form>
    </div>
  );
}

export default SeeTransactions;