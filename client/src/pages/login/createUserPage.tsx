import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { register, reset, checkEmail, checkUsername } from "../../features/auth/authSlice";
import  validations  from "../../features/passwordUserValidations";

export function CreateUserPage() {
  const [values, setValues] = React.useState({
    username: "",
    password: "",
    re_password: "",
    email:""
  });

  const { username, email, password, re_password } = values;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {userState, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth)

  function handleSubmit( evt: any )
  {
    evt.preventDefault()
    if (password !== re_password) {
        toast.error("Passwords do not match")
    } else if ( validations.passWordValid( password,username ) && validations.userValid( username ) )
    {
      checkExistingUser();

    }
  }

  function handleChange(evt:any) {
    
    const { target } = evt;
    const { name, value } = target;
    const newValues = {
      ...values,
      [name]: value,
    };
    setValues(newValues);
  }

  React.useEffect(() => {
      if (isError) {
        toast.error(message);
          toast.error('Ha ocurrido un error, intentelo de nuevo.')
      }

      if (isSuccess || userState) {
          navigate("/")
          toast.success("Se ha enviado un correo de activacion. Porfavor revise su correo")
      }
      dispatch(reset())
  }, [isError, isSuccess, userState, navigate, dispatch])

  async function checkExistingUser() {
      const emailCheckResponse = await dispatch(checkEmail({ email }));
      const usernameCheckResponse = await dispatch(checkUsername({ username }));

      if (emailCheckResponse.payload.exists) {
        toast.error("Este correo electrónico ya está registrado");
      } else if (usernameCheckResponse.payload.exists) {
        toast.error("Este nombre de usuario ya está en uso");
      } else {
        const userData = {
          username,
          email,
          password,
          re_password
        };
        dispatch(register(userData));
      }
    }

  return (
    <div className="flex items-center justify-center h-screen">
          <form className="bg-white p-8 rounded shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
              CryptoTradeExpress
            </h1>
            <input
              id="username"
              name="username"
              type="username"
              value={values.username}
              onChange={handleChange}
              placeholder="Usuario"
              className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              id="password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              id="re_password"
              name="re_password"
              type="password"
              value={values.re_password}
              onChange={handleChange}
              placeholder="Confirmar Contraseña"
              className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmit}
            >
            Registrarse
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
              <Link to="/">Inicio</Link>
            </button>
          </form>
        </div>
  );
}