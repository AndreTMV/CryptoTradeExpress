import React from "react";
import { Link } from "react-router-dom";

export function LoginPage() {
  const [values, setValues] = React.useState({
    user: "",
    password: "",
  });

  function handleSubmit(evt: any) {
    evt.preventDefault();
    // Aquí puedes usar values para enviar la información
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
        {/* Estilo para el enlace de restablecer contraseña */}
        <Link to="/reset-password" className="text-blue-500 text-sm mb-4 block">¿Olvidaste tu contraseña?</Link>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSubmit}
          >
            Iniciar sesión
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
            <Link to="/">Inicio</Link>
          </button>
        </div>
      </form>
    </div>
  );
}