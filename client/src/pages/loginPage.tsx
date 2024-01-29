import React from "react";
import { Link } from "react-router-dom";

export function LoginPage() {
  const [values, setValues] = React.useState({
    user: "",
    password: "",
  });

  function handleSubmit(evt: any) {
    /*
      Previene el comportamiento default de los
      formularios el cual recarga el sitio
    */
    evt.preventDefault();

    // Aquí puedes usar values para enviar la información
  }

  function handleChange(evt:any) {
    /*
      evt.target es el elemento que ejecuto el evento
      name identifica el input y value describe el valor actual
    */
    const { target } = evt;
    const { name, value } = target;

    /*
      Este snippet:
      1. Clona el estado actual
      2. Reemplaza solo el valor del
         input que ejecutó el evento
    */
    const newValues = {
      ...values,
      [name]: value,
    };

    // Sincroniza el estado de nuevo
    setValues(newValues);
  }

  return (
    <div className="flex items-center justify-center h-screen">
          <form className="bg-white p-8 rounded shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
              CryptoTradeExpress
            </h1>
            <label className="block mb-2 text-sm font-bold" htmlFor="user">
              User
            </label>
            <input
              id="user"
              name="user"
              type="user"
              value={values.user}
              onChange={handleChange}
              placeholder="Usuario"
              className="w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
            />

            <label className="block mb-2 text-sm font-bold" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className="w-full border p-2 mb-4 rounded-md focus:outline-none focus:border-blue-500"
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