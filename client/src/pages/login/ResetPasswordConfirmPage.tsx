
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { reset, resetPasswordConfirm } from "../../features/auth/authSlice";
import validations from "../../features/passwordUserValidations";
import type { RootState, AppDispatch } from "../../app/store";

// Helper para validaciones en vivo
function getPasswordValidationStatus(password: string) {
  return [
    {
      label: "Al menos 13 caracteres",
      valid: password.length >= 13,
    },
    {
      label: "Incluye un carácter especial ('.' o '-')",
      valid: /[.-]/.test(password),
    },
    {
      label: "Incluye al menos un número",
      valid: /\d/.test(password),
    },
    {
      label: "No incluye sucesiones como 123 o abc",
      valid: !/(123|abc)/i.test(password),
    }
  ];
}

export function ResetPasswordPageConfirm() {
  const { uid, token } = useParams();
  const [values, setValues] = useState({
    new_password: "",
    re_new_password: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isError, isSuccess, isLoading, message } = useSelector((state: RootState) => state.auth);

  const passwordRules = getPasswordValidationStatus(values.new_password);

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    if (values.new_password !== values.re_new_password) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (!validations.passWordValid(values.new_password, "")) {
      return;
    }
    if (!uid || !token) {
      toast.error("Token inválido. Intenta de nuevo desde el enlace de tu correo.");
      return;
    }
    dispatch(
      resetPasswordConfirm({
        uid,
        token,
        new_password: values.new_password,
        re_new_password: values.re_new_password,
      })
    );
  }

  useEffect(() => {
    if (isError) {
      toast.error(message || "Error al cambiar la contraseña");
    }
    if (isSuccess) {
      toast.success("Se ha restablecido tu contraseña exitosamente");
      navigate("/login");
    }
    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, navigate, dispatch]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-slate-100">
      <form
        className="w-full max-w-sm bg-white/95 rounded-2xl shadow-2xl p-8 border border-slate-100 flex flex-col gap-3"
        onSubmit={handleSubmit}
        autoComplete="on"
      >
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">
          Restablecer Contraseña
        </h1>
        <p className="text-center mb-3 text-slate-500">
          Ingresa tu nueva contraseña
        </p>

        <label htmlFor="new_password" className="font-semibold text-slate-600">
          Nueva contraseña
        </label>
        <input
          id="new_password"
          name="new_password"
          type="password"
          value={values.new_password}
          onChange={handleChange}
          placeholder="Nueva contraseña"
          className="w-full border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black placeholder-gray-400"
          autoComplete="new-password"
        />

        {/* Validaciones visuales */}
        <ul className="mb-2 ml-2 flex flex-col gap-2">
          {passwordRules.map((rule, idx) => (
            <li
              key={idx}
              className={`flex items-center gap-3 py-1 pl-2 rounded transition ${rule.valid ? "bg-green-50" : ""
                }`}
            >
              <span
                className={
                  rule.valid
                    ? "inline-block w-5 h-5 rounded-full bg-green-400 text-white text-base flex items-center justify-center"
                    : "inline-block w-5 h-5 rounded-full bg-gray-300 text-base flex items-center justify-center"
                }
                aria-hidden="true"
              >
                {rule.valid ? "✓" : ""}
              </span>
              <span className={`text-base ${rule.valid ? "text-green-700 font-medium" : "text-gray-500"}`}>
                {rule.label}
              </span>
            </li>
          ))}
        </ul>

        <label htmlFor="re_new_password" className="font-semibold text-slate-600">
          Confirmar contraseña
        </label>
        <input
          id="re_new_password"
          name="re_new_password"
          type="password"
          value={values.re_new_password}
          onChange={handleChange}
          placeholder="Confirmar contraseña"
          className="w-full border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black placeholder-gray-400"
          autoComplete="new-password"
        />

        <button
          type="submit"
          className={`w-full bg-blue-500 hover:bg-blue-600 transition text-white font-bold py-2 px-4 rounded-lg shadow mt-4 ${isLoading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          disabled={isLoading}
        >
          Cambiar Contraseña
        </button>
        <Link
          to="/login"
          className="text-center text-blue-500 hover:underline text-sm mt-2"
        >
          Volver al inicio
        </Link>
      </form>
    </div>
  );
}
