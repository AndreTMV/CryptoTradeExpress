import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { register, reset, checkEmail, checkUsername } from "../../features/auth/authSlice";
import validations from "../../features/passwordUserValidations";
import type { RootState, AppDispatch } from "../../app/store";

// Helper para validación visual de la contraseña
function getPasswordValidationStatus(password: string, username: string) {
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
    },
    {
      label: "No es demasiado similar al usuario",
      valid: username.length > 0 ? !password.includes(username) : true,
    },
  ];
}

export function CreateUserPage() {
  const [values, setValues] = useState({
    username: "",
    password: "",
    re_password: "",
    email: ""
  });

  const [isChecking, setIsChecking] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userState, isError, isSuccess, isLoading, message } = useSelector((state: RootState) => state.auth);

  const { username, password, re_password, email } = values;
  const passwordRules = getPasswordValidationStatus(password, username);

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();

    // Validación visual en tiempo real, pero mantenemos toast para submit
    if (password !== re_password) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (!validations.passWordValid(password, username)) {
      return;
    }
    if (!validations.userValid(username)) {
      return;
    }

    setIsChecking(true);
    const emailCheckResponse = await dispatch(checkEmail({ email }));
    const usernameCheckResponse = await dispatch(checkUsername({ username }));
    setIsChecking(false);

    if (emailCheckResponse.payload?.exists) {
      toast.error("Este correo electrónico ya está registrado");
    } else if (usernameCheckResponse.payload?.exists) {
      toast.error("Este nombre de usuario ya está en uso");
    } else {
      dispatch(register(values));
    }
  }

  useEffect(() => {
    if (isError) {
      toast.error(message || "Ha ocurrido un error, intentelo de nuevo.");
    }
    if (isSuccess || userState) {
      toast.success("Se ha enviado un correo de activación. Por favor revise su correo");
      navigate("/login");
    }
    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, userState, message, dispatch, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-slate-100">
      <form
        className="w-full max-w-sm bg-white/95 rounded-2xl shadow-2xl p-8 border border-slate-100 flex flex-col gap-3"
        onSubmit={handleSubmit}
        autoComplete="on"
      >
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-600">CryptoTradeExpress</h1>
        <p className="text-center mb-4 text-slate-500">Crea tu cuenta</p>

        <label htmlFor="username" className="font-semibold text-slate-600">Usuario</label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={handleChange}
          placeholder="Usuario"
          className="w-full border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black placeholder-gray-400"
          autoFocus
        />

        <label htmlFor="email" className="font-semibold text-slate-600">Correo electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="usuario@correo.com"
          className="w-full border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black placeholder-gray-400"
          autoComplete="email"
        />

        <label htmlFor="password" className="font-semibold text-slate-600">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={handleChange}
          placeholder="Contraseña"
          className="w-full border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black placeholder-gray-400"
          autoComplete="new-password"
        />
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
        <label htmlFor="re_password" className="font-semibold text-slate-600">Confirmar Contraseña</label>
        <input
          id="re_password"
          name="re_password"
          type="password"
          value={re_password}
          onChange={handleChange}
          placeholder="Confirmar contraseña"
          className="w-full border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-black placeholder-gray-400"
          autoComplete="new-password"
        />

        <button
          type="submit"
          className={`w-full bg-blue-500 hover:bg-blue-600 transition text-white font-bold py-2 px-4 rounded-lg shadow mt-4 ${isLoading || isChecking ? "opacity-60 cursor-not-allowed" : ""
            }`}
          disabled={isLoading || isChecking}
        >
          {isLoading || isChecking ? "Registrando..." : "Registrarse"}
        </button>

        <Link
          to="/login"
          className="text-center text-blue-500 hover:underline text-sm mt-4"
        >
          ¿Ya tienes cuenta? Iniciar sesión
        </Link>
      </form>
    </div>
  );
}
