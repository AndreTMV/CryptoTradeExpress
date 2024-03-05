import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux'
import { checkOTP, reset, getUserInfo } from '../../features/auth/authSlice'
import Spinner from "../../components/Spinner";

export function OTPVerification() {
  const [values, setValues] = React.useState({
    otp:""
  });

  const { otp } = values;
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isError, isSuccess, isLoading, message, userInfo, OTPverified } = useSelector((state) => state.auth)
  const location = useLocation();
  const { state } = location;
  const { email, password } = state || {};

  function handleSubmit(evt) {
    evt.preventDefault();
    const userData = {
      otp,
      email,
      password
    };
    dispatch(checkOTP(userData))
  }

  function handleChange(evt) {
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
      toast.error("El otp proporcionado es incorrecto");
    }

    if (OTPverified && !isLoading) {
        navigate("/dashboard");
        toast.success("Se ha verificado el otp")
    }

    dispatch(reset());
    dispatch(getUserInfo())
  }, [isError, OTPverified, isLoading, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
          CryptoTradeExpress
        </h1>
        {isLoading && <Spinner />}

        <input
          id="otp"
          name="otp"
          type="password"
          value={values.otp}
          onChange={handleChange}
          placeholder="Código OTP"
          className="text-black w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleSubmit}
        >
          Iniciar sesión
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
          <Link to="/">Inicio</Link>
        </button>
      </form>
    </div>
  );
}