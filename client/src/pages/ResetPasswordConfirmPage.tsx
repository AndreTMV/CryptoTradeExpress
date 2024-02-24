import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { reset, resetPasswordConfirm } from "../features/auth/authSlice";
import validations from "../features/passwordUserValidations";

export function ResetPasswordPageConfirm()
{
    const { uid, token } = useParams()
    const [values, setValues] = React.useState({
    new_password:"",
    re_new_password: "",
  });

  const {  new_password, re_new_password } = values;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {userState, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth)

  function handleSubmit( evt: any )
  {
    evt.preventDefault()
    if (new_password !== re_new_password) {
        toast.error("Passwords do not match")
    } else if (validations.passWordValid(new_password))
    {
      const userData = {
          uid,
          token,
          new_password,
          re_new_password
      }
      dispatch(resetPasswordConfirm(userData))
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
          toast.error(message)
      }

      if (isSuccess) {
          navigate("/")
          toast.success("Se ha restablecido su contraseña exitosamente")
      }
      dispatch(reset())
  }, [isError, isSuccess, userState, navigate, dispatch])

  return (
    <div className="flex items-center justify-center h-screen">
          <form className="bg-white p-8 rounded shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
              CryptoTradeExpress
            </h1>
            <input
              id="new_password"
              name="new_password"
              type="password"
              value={values.new_password}
              onChange={handleChange}
              placeholder="Contraseña"
              className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              id="re_new_password"
              name="re_new_password"
              type="password"
              value={values.re_new_password}
              onChange={handleChange}
              placeholder="Confirmar Contraseña"
              className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmit}
            >
            Cambiar Contraseña
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
              <Link to="/">Inicio</Link>
            </button>
          </form>
        </div>
  );
}