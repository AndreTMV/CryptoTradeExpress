import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-100 via-white to-slate-100">
      <div className="flex flex-col items-center gap-5 rounded-2xl bg-white/90 px-12 py-10 shadow-xl">
        <h1 className="mb-6 text-3xl font-bold text-blue-600">CryptoTradeExpress</h1>
        <Link
          to="/login"
          className="w-60 rounded-lg bg-blue-500 py-3 text-center text-lg font-semibold text-white shadow transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/create-user"
          className="w-60 rounded-lg bg-green-500 py-3 text-center text-lg font-semibold text-white shadow transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}
