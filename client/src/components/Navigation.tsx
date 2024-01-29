import { Link } from 'react-router-dom';
export function Navigation() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
          <Link to="/login">Iniciar sesión</Link>
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          <Link to="/create-user">Registrarse</Link>
        </button>
      </div>
    </div>
  );
}
