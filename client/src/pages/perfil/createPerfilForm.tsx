import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createPerfil, reset, checkPerfil, perfilInfo, updateHiddenInformation } from "../../features/perfil/perfilSlice";
import { format } from "date-fns";


import Datepicker from "tailwind-datepicker-react"
var today = new Date();
var dd = String( today.getDate() ).padStart( 2, '0' );
var mm = String( today.getMonth() + 1 ).padStart( 2, '0' ); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
const optionsInicio = {
  title: "Cumpleaños",
  autoHide: true,
  todayBtn: false,
  clearBtn: true,
  clearBtnText: "Clear",
  maxDate: new Date( "2007-01-01" ),
  minDate: new Date( "1962-01-01" ),
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
  defaultDate: new Date( today ),
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

function formatJoinDate( joinDate: Date )
{
  return format( new Date( joinDate ), "dd/MM/yyyy" );
}
export function CreatePerfilPage()
{

  function formatDate( date: Date )
  {
    const year = date.getFullYear();
    const month = String( date.getMonth() + 1 ).padStart( 2, '0' ); // Agrega un cero inicial si el mes es de un solo dígito
    const day = String( date.getDate() ).padStart( 2, '0' ); // Agrega un cero inicial si el día es de un solo dígito
    return `${ year }-${ month }-${ day }`;
  }

  const [birthDay, setBirthDay] = useState<Date | null>( null );
  const [showBirthDay, setShowBirthDay] = useState<boolean>( false );
  const [isProfileExist, setIsProfileExist] = useState( false );
  const [perfil, setPerfil] = useState()
  const [loading, setLoading] = useState( true );
  const [values, setValues] = React.useState( {
    name: "",
    description: "",
    interested_cryptos: [],
  } );
  const [privacySettings, setPrivacySettings] = useState( {} );
  const { name, description, interested_cryptos } = values;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector( ( state ) => state.auth )
  const { perfilIsError, perfilIsLoading, perfilIsSuccess, perfilMessage } = useSelector( ( state ) => state.perfil )

  useEffect( () =>
  {
    dispatch( checkPerfil( { id: userInfo.id } ) )
      .then( ( response ) =>
      {
        if ( response.payload )
        {
          setIsProfileExist( true );
          dispatch( perfilInfo( { id: userInfo.id } ) )
            .then( ( response ) =>
            {
              setPerfil( response.payload )
              initializePrivacySettings( response.payload );
            } )
            .catch( ( error ) =>
            {
              console.log( error )
            } )
        } else
        {
          setIsProfileExist( false );
        }
      } )
      .catch( ( error ) =>
      {
        console.log( error )
      } )
      .finally( () =>
      {
        setLoading( false );
      } );
  }, [dispatch, userInfo.id] );
  // Función para inicializar la configuración de privacidad con valores predeterminados

  const initializePrivacySettings = ( profileData ) =>
  {
    const initialSettings = {};
    for ( const key in profileData )
    {
      initialSettings[key] = false;
    }
    setPrivacySettings( initialSettings );
  };

  const handlePrivacyChange = ( fieldName ) =>
  {
    setPrivacySettings( ( prevSettings ) => ( {
      ...prevSettings,
      [fieldName]: !prevSettings[fieldName],
    } ) );
  };

  function handleSubmit( evt: any )
  {
    evt.preventDefault()
    const finalBirthDay = formatDate( birthDay )

    const perfilData = {
      username: userInfo.id,
      name,
      description,
      interested_cryptos,
      birth_day: finalBirthDay
    }
    dispatch( createPerfil( perfilData ) )
  }

  const handleChangeBirthDay = ( selectedDate: Date ) =>
  {
    setBirthDay( selectedDate );
    console.log( selectedDate );
  };

  const handleCloseBirthDay = ( state: boolean ) =>
  {
    setShowBirthDay( state );
  };

  const handleSubmitUpdate = ( evt: any ) =>
  {
    navigate( '/updatePerfil', {
      state: {
        perfil
      }
    } )
  }

  const handlePrivateInformations = ( evt: any ) =>
  {
    evt.preventDefault();
    console.log( privacySettings )
    let perfilInformation = {
      username: perfil.username,
      hideInformation: ""
    }
    let information = [];
    Object.entries( privacySettings ).forEach( ( [key, value] ) =>
    {
      if ( value )
      {
        information.push( key )
      }
    } );
    console.log( information.toString() )
    perfilInformation.hideInformation = information.toString()
    dispatch( updateHiddenInformation( perfilInformation ) )
      .then( ( response ) =>
      {
        toast.success( "Se ha puesto la informacion seleccionada en privada" )

      } )
      .catch( ( error ) =>
      {
        toast.error( "Ha ocurrido un error, intentelo de nuevo" )

      } )
  }

  function handleChange( evt: any )
  {

    const { target } = evt;
    const { name, value } = target;
    const newValue = name === 'interested_cryptos' ? value.split( ',' ) : value;

    const newValues = {
      ...values,
      [name]: newValue,
    };
    setValues( newValues );
  }

  React.useEffect( () =>
  {
    if ( perfilIsError )
    {
      toast.error( perfilMessage );
      toast.error( 'Ha ocurrido un error, intentelo de nuevo.' )
    }

    if ( perfilIsSuccess )
    {
      navigate( "/dashboard" )
      toast.success( "Se ha modificado la informacion de tu perfil" )
    }
    dispatch( reset() )
  }, [perfilIsError, perfilIsSuccess, navigate, dispatch] )

  if ( loading )
  {
    return <div>Cargando...</div>;
  }

  if ( isProfileExist && perfil )
  {
    return (
      <div className="mt-20">
        <div className="flex items-center justify-center h-screen mt-6">
          <div className="bg-white p-8 rounded shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">CryptoTradeExpress</h1>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 relative flex justify-between items-center p-2">
                Nombre:
                <input type="checkbox" className="absolute left-1/2 -translate-x-1/2 w-4 h-4 peer appearance-none rounded-md"
                  checked={privacySettings["name"]}
                  onChange={() => handlePrivacyChange( "name" )}
                />
                <span className="w-10 h-6 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-4"></span>
              </label>
              <p className="text-gray-800 text-center"> {perfil.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 relative flex justify-between items-center p-2">
                Descripcion:
                <input type="checkbox" className="absolute left-1/2 -translate-x-1/2 w-4 h-4 peer appearance-none rounded-md"
                  checked={privacySettings["description"]}
                  onChange={() => handlePrivacyChange( "description" )}
                />
                <span className="w-10 h-6 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-4"></span>
              </label>
              <p className="text-gray-800 text-center">{perfil.description} </p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 relative flex justify-between items-center p-2">
                Cryptos de interes:
                <input type="checkbox" className="absolute left-1/2 -translate-x-1/2 w-4 h-4 peer appearance-none rounded-md"
                  checked={privacySettings["interested_cryptos"]}
                  onChange={() => handlePrivacyChange( "interested_cryptos" )}
                />
                <span className="w-10 h-6 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-4"></span>
              </label>
              <p className="text-gray-800 text-center">{perfil.interested_cryptos.join( ', ' )} </p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 relative flex justify-between items-center p-2">
                Fecha de nacimiento:
                <input type="checkbox" className="absolute left-1/2 -translate-x-1/2 w-4 h-4 peer appearance-none rounded-md"
                  checked={privacySettings["birth_day"]}
                  onChange={() => handlePrivacyChange( "birth_day" )}
                />
                <span className="w-10 h-6 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-4"></span>
              </label>
              <p className="text-gray-800 text-center">{perfil.birth_day}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 relative flex justify-between items-center p-2">
                Calificacion promedio de los Videos:
                <input type="checkbox" className="absolute left-1/2 -translate-x-1/2 w-4 h-4 peer appearance-none rounded-md"
                  checked={privacySettings["videos_calification"]}
                  onChange={() => handlePrivacyChange( "videos_calification" )}
                />
                <span className="w-10 h-6 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-4"></span>
              </label>
              <p className="text-gray-800 text-center">{perfil.videos_calification}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 relative flex justify-between items-center p-2">
                Amigos:
                <input type="checkbox" className="absolute left-1/2 -translate-x-1/2 w-4 h-4 peer appearance-none rounded-md"
                  checked={privacySettings["friend_list"]}
                  onChange={() => handlePrivacyChange( "friend_list" )}
                />
                <span className="w-10 h-6 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-4"></span>
              </label>
              <p className="text-gray-800 text-center">{perfil.friend_list_count}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 relative flex justify-between items-center p-2">
                Miembro desde:
                <input type="checkbox" className="absolute left-1/2 -translate-x-1/2 w-4 h-4 peer appearance-none rounded-md"
                  checked={privacySettings["date_joined"]}
                  onChange={() => handlePrivacyChange( "date_joined" )}
                />
                <span className="w-10 h-6 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-4"></span>
              </label>
              <p className="text-gray-800 text-center">{formatJoinDate( perfil.date_joined )}</p>
            </div>
            <div className="mb-4 flex flex-row justify-between">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3 mr-2"
                onClick={handleSubmitUpdate}
              >
                Modificar
              </button>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3 mr-2"
                onClick={handlePrivateInformations}
              >
                Privado
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3">
                <Link to="/dashboard">Regresar</Link>
              </button>
            </div>
            <div className="flex justify-center">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3 mr-2">
                <Link to='/API'>Conectar con binance</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <Datepicker options={optionsInicio} onChange={handleChangeBirthDay} show={showBirthDay} setShow={handleCloseBirthDay} />
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3"
          onClick={handleSubmit}
        >
          Crear
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
          <Link to="/dashboard">Regresar</Link>
        </button>
      </form>
    </div>
  );
}
//   if (isProfileExist && perfil) {
//     return (
//       <div className="flex items-center justify-center h-screen mt-6">
//         <div className="bg-white p-8 rounded shadow-md">
//           <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">CryptoTradeExpress</h1>
//           <div className="mb-4">
//             <label className="block text-gray-700 font-bold mb-2">Nombre:
//             </label>
//             <p className="text-gray-800">{perfil.name}</p>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 font-bold mb-2">Descripción:</label>
//             <p className="text-gray-800">{perfil.description}</p>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 font-bold mb-2">Cryptos de interés:</label>
//             <p className="text-gray-800">{perfil.interested_cryptos.join(', ')}</p>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 font-bold mb-2">Fecha de nacimiento:</label>
//             <p className="text-gray-800">{perfil.birth_day}</p>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 font-bold mb-2">Calificacion promedio de los Videos:</label>
//             <p className="text-gray-800">{perfil.videos_calification}</p>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 font-bold mb-2">Amigos:</label>
//             <p className="text-gray-800">{perfil.friend_list_count}</p>
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 font-bold mb-2">Miembro desde:</label>
//             <p className="text-gray-800">{formatJoinDate(perfil.date_joined) }</p>
//           </div>
//           <button
//             type="button"
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3 mr-2"
//             onClick={handleSubmitUpdate}
//           >
//           Modificar
//           </button>
//           <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3">
//             <Link to="/dashboard">Regresar</Link>
//           </button>
//         </div>
//       </div>
//     );
//  }