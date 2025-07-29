import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-100 via-white to-slate-100">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-slate-100 bg-white/95 p-10 shadow-2xl">
        <h1 className="mb-2 text-center text-4xl font-bold text-blue-600">404</h1>
        <p className="mb-6 text-center text-lg text-slate-600">
          ¡Ups! Página no encontrada.
        </p>
        <Link
          to="/"
          className="rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white shadow transition hover:bg-blue-600"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
