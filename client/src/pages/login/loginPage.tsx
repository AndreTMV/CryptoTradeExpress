import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { login, sendOTP, reset } from "../../features/auth/authSlice";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isError, isSuccess, isLoading, message } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!values.email || !values.password) {
      toast.error("Por favor ingresa email y contraseña");
      return;
    }
    dispatch(login({ email: values.email, password: values.password }));
  };

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setValues((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    dispatch(reset());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isError) toast.error(message || "El email o contraseña son incorrectas");
    if (isSuccess && !isError) {
      dispatch(sendOTP({ email: values.email }));
      toast.success("Se ha enviado el OTP a tu correo.");
      navigate("/OTP-verification", { state: { email: values.email } });
    }
    return () => {
      dispatch(reset());
    };
    // eslint-disable-next-line
  }, [isError, isSuccess, message, dispatch, navigate, values.email]);

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-slate-100">
      <form
        className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white/95 p-8 pt-10 shadow-2xl"
        onSubmit={handleSubmit}
        autoComplete="on"
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-blue-600">
          CryptoTradeExpress
        </h1>
        <p className="mb-8 text-center text-slate-500">Inicia sesión en tu cuenta</p>
        <div className="mb-5">
          <label htmlFor="email" className="mb-1 block font-semibold text-slate-600">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoFocus
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            placeholder="usuario@correo.com"
            className="w-full rounded-lg border border-slate-200 p-2 text-black transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="relative mb-2">
          <label htmlFor="password" className="mb-1 block font-semibold text-slate-600">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            placeholder="Tu contraseña"
            className="w-full rounded-lg border border-slate-200 p-2 pr-10 text-black transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="button"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-8 p-1 text-slate-400 hover:text-blue-500"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="mb-4 mt-1 flex items-center justify-between">
          <Link
            to="/reset-password"
            className="text-sm text-blue-500 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-2 font-bold text-white shadow transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70 ${isLoading ? "animate-pulse" : ""
            }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="size-5 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3.536-3.536A9 9 0 0020 12z"
                />
              </svg>
              Iniciando...
            </span>
          ) : (
            "Iniciar sesión"
          )}
        </button>

        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="text-sm text-slate-500">
            ¿No tienes cuenta?
            <Link to="/register" className="ml-2 text-blue-500 hover:underline">
              Regístrate aquí
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
