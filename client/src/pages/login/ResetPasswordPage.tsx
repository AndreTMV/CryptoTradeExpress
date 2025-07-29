import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, reset } from "../../features/auth/authSlice";
import Spinner from "../../components/Spinner";
import type { RootState, AppDispatch } from "../../app/store";

export function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useSelector((state: RootState) => state.auth);

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setEmail(evt.target.value);
  }

  function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    if (!email) {
      toast.error("Por favor, ingresa tu correo electrónico");
      return;
    }
    dispatch(resetPassword({ email }));
  }

  useEffect(() => {
    if (isError) {
      toast.error(message || "Ha ocurrido un error.");
    }
    if (isSuccess) {
      toast.success("Un email de restablecimiento ha sido enviado a su correo.");
      navigate("/login");
    }
    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, navigate, dispatch]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-100 via-white to-slate-100">
      <form
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-slate-100 bg-white/95 p-8 shadow-2xl"
        onSubmit={handleSubmit}
        autoComplete="on"
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-blue-600">CryptoTradeExpress</h1>
        <p className="mb-3 text-center text-slate-500">¿Olvidaste tu contraseña?</p>

        <label htmlFor="email" className="font-semibold text-slate-600">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="usuario@correo.com"
          className="w-full rounded-lg border border-slate-200 p-2 text-black transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          autoComplete="email"
        />

        <button
          type="submit"
          className={`mt-3 flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-2 font-bold text-white shadow transition hover:bg-blue-600 ${isLoading ? "cursor-not-allowed opacity-60" : ""
            }`}
          disabled={isLoading}
        >
          {isLoading ? <Spinner size={22} color="#fff" /> : "Cambiar Contraseña"}
        </button>

        <Link
          to="/login"
          className="mt-2 text-center text-sm text-blue-500 hover:underline"
        >
          Volver al inicio
        </Link>
      </form>
    </div>
  );
}
