import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { checkOTP, reset } from "../../features/auth/authSlice";
import Spinner from "../../components/Spinner";
import type { RootState, AppDispatch } from "../../app/store";

export function OTPVerification() {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isError, isLoading, OTPverified } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const { state } = location;
  const { email, password } = state || {};

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setOtp(evt.target.value);
  }

  function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    if (!otp) {
      toast.error("Por favor, ingresa el código OTP");
      return;
    }
    const userData = {
      otp,
      email,
      password,
    };
    dispatch(checkOTP(userData));
  }

  useEffect(() => {
    if (isError) {
      toast.error("El OTP proporcionado es incorrecto.");
    }
    if (OTPverified && !isLoading) {
      toast.success("OTP verificado correctamente.");
      navigate("/dashboard");
    }
    return () => {
      dispatch(reset());
    };
  }, [isError, OTPverified, isLoading, navigate, dispatch]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-100 via-white to-slate-100">
      <form
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-slate-100 bg-white/95 p-8 shadow-2xl"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-blue-600">CryptoTradeExpress</h1>
        <p className="mb-2 text-center text-slate-500">
          Ingresa el código OTP que recibiste en tu correo.
        </p>
        <input
          id="otp"
          name="otp"
          type="text"
          maxLength={10}
          value={otp}
          onChange={handleChange}
          placeholder="Código OTP"
          className="w-full rounded-lg border border-slate-200 p-2 text-center font-mono text-xl tracking-widest text-black transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          autoComplete="one-time-code"
          inputMode="numeric"
        />
        <button
          type="submit"
          className={`mt-2 flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-2 font-bold text-white shadow transition hover:bg-blue-600 ${isLoading ? "cursor-not-allowed opacity-60" : ""
            }`}
          disabled={isLoading}
        >
          {isLoading ? <Spinner size={22} color="#fff" /> : "Verificar OTP"}
        </button>
        <Link
          to="/login"
          className="mt-4 text-center text-sm text-blue-500 hover:underline"
        >
          Volver al inicio
        </Link>
      </form>
    </div>
  );
}
