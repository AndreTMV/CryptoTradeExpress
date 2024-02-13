import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export function ActivationPage() {
  function handleSubmit(evt: any) {
    evt.preventDefault();
    // Aquí puedes agregar la lógica para activar la cuenta
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
        Activar Cuenta
      </h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSubmit}
      >
        Activar Cuenta
      </button>
    </div>
  );
}