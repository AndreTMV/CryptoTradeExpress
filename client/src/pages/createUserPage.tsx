import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";

export function CreateUserPage() {
  const [values, setValues] = React.useState({
    user: "",
    password: "",
    email:""
  });

  const { user, email, password } = values;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {userState, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth)

  function handleSubmit(evt: any) {
    evt.preventDefault();
    const userData = {
      user,
      email,
      password
    }
    dispatch(register(userData));
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
          toast.error(message)
      }

      if (isSuccess || user) {
          navigate("/")
          toast.success("Se ha enviado un correo de activacion. Porfavor revise su correo")
      }
  }, [isError, isSuccess, userState, navigate, dispatch])

  return (
    <div className="flex items-center justify-center h-screen">
          <form className="bg-white p-8 rounded shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
              CryptoTradeExpress
            </h1>
            <input
              id="user"
              name="user"
              type="user"
              value={values.user}
              onChange={handleChange}
              placeholder="Usuario"
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
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
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