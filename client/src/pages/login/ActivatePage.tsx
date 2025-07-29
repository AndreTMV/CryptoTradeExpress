import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { activate, reset } from "../../features/auth/authSlice";
import Spinner from "../../components/Spinner";
import type { RootState, AppDispatch } from "../../app/store";

export function ActivationPage() {
  const { uid, token } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid || !token) {
      toast.error("Parámetros inválidos de activación.");
      return;
    }
    dispatch(activate({ uid, token }));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message || "Ocurrió un error al activar tu cuenta.");
    }
    if (isSuccess) {
      toast.success("¡Tu cuenta ha sido activada! Ya puedes iniciar sesión.");
      navigate("/login");
    }
    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, navigate, dispatch]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-100 via-white to-slate-100">
      <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-100 bg-white/95 p-8 shadow-2xl">
        <h1 className="mb-3 text-center text-3xl font-bold text-blue-600">
          Activar Cuenta
        </h1>
        <p className="mb-5 text-center text-slate-500">
          Haz clic en el botón para activar tu cuenta.
        </p>
        {isLoading && <Spinner size={24} />}
        <button
          className={`mt-2 w-full rounded-lg bg-blue-500 px-4 py-2 font-bold text-white shadow transition hover:bg-blue-600 ${isLoading ? "cursor-not-allowed opacity-60" : ""
            }`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          Activar Cuenta
        </button>
      </div>
    </div>
  );
}
