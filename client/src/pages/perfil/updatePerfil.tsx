import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updatePerfil, } from "../../features/perfil/perfilSlice";
import Datepicker from "tailwind-datepicker-react"
import { update } from "plotly.js";

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
const optionsInicio = {
	title: "Cumpleaños",
	autoHide: true,
	todayBtn: false,
	clearBtn: true,
	clearBtnText: "Clear",
	maxDate: new Date("2007-12-31"),
	minDate: new Date("1962-01-01"),
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

export function ActualizarPerfilPage() {

  function formatDate(date:Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Agrega un cero inicial si el mes es de un solo dígito
      const day = String(date.getDate()).padStart(2, '0'); // Agrega un cero inicial si el día es de un solo dígito
      return `${year}-${month}-${day}`;
  }
  const [birthDay, setBirthDay] = useState<Date | null>(null);
  const [showBirthDay, setShowBirthDay] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState({
    perfilId:"",
    name: "",
    description: "",
    interested_cryptos: "",
    birth_day: "",
  });

  const { name, description, interested_cryptos } = values;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let { perfil } = location.state || {}
  const { perfilIsError, perfilIsLoading, perfilIsSuccess, perfilMessage } = useSelector((state) => state.perfil);

  useEffect(() => {
    if ( perfil )
    {
        setValues( {
          perfilId: perfil.id,
          name: perfil.name,
          description: perfil.description,
          interested_cryptos: perfil.interested_cryptos.join( "," ),
          birth_day: perfil.birth_day
        })
    }
    setLoading(false);
  }, [perfil]);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {

    evt.preventDefault();
    let finalBirthDay
    if(birthDay !== null)
        finalBirthDay = formatDate(birthDay)

    const updatedPerfil = {
      username:perfil.username,
      perfilId:perfil.id,
      name: name.trim() !== "" ? name : perfil.name,
      description: description.trim() !== "" ? description : perfil.description,
      interested_cryptos: interested_cryptos.trim() !== "" ? interested_cryptos.split(",") : perfil.interested_cryptos,
      birth_day: birthDay !== null ? finalBirthDay : perfil.birth_day,
    };
    dispatch(updatePerfil(updatedPerfil))
      .then(() => {
        toast.success("Perfil actualizado correctamente");
        navigate("/dashboard");
      })
      .catch((error) => {
        toast.error("Error al actualizar el perfil. Inténtalo de nuevo.");
      });
  };
  const handleChangeBirthDay = (selectedDate: Date) => {
	setBirthDay(selectedDate);
	console.log(selectedDate);
  };

  const handleCloseBirthDay = (state: boolean) => {
	setShowBirthDay(state);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
          Actualizar Perfil
        </h1>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Nombre"
          className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          name="description"
          value={description}
          onChange={handleChange}
          placeholder="Descripción"
          className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          name="interested_cryptos"
          value={interested_cryptos}
          onChange={handleChange}
          placeholder="Cryptos de interés (separados por comas)"
          className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
        />
    	<Datepicker options={optionsInicio} onChange={handleChangeBirthDay} show={showBirthDay} setShow={handleCloseBirthDay} />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3"
          onClick={handleSubmit}
        >
          Guardar Cambios
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
          <Link to="/dashboard">Cancelar</Link>
        </button>
      </form>
    </div>
  );
}
