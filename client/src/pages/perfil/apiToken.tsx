import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "../../app/store";
import { setKeys, reset } from "../../features/perfil/perfilSlice";

type FormState = {
  api_key: string;
  secret_key: string;
};

const APIPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { userInfo } = useSelector((s: RootState) => s.auth);
  const { isLoading, isError, message } =
    useSelector((s: RootState) => s.perfil);

  const [values, setValues] = React.useState<FormState>({
    api_key: "",
    secret_key: "",
  });
  const [showApi, setShowApi] = React.useState(false);
  const [showSecret, setShowSecret] = React.useState(false);

  const isValid = values.api_key.trim().length > 0 && values.secret_key.trim().length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!userInfo?.id) {
      toast.error("No se pudo identificar al usuario.");
      return;
    }
    if (!isValid) {
      toast.error("Completa ambos campos.");
      return;
    }

    try {
      await dispatch(
        setKeys({
          user: userInfo.id,
          key: values.api_key.trim(),
          secret: values.secret_key.trim(),
        })
      ).unwrap();
      toast.success("Se configuraron tus llaves correctamente.");
      navigate("/dashboard");
    } catch (err) {
      toast.error("No se pudieron guardar las llaves. Intenta de nuevo.");
      console.error(err);
    }
  };

  React.useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow ring-1 ring-slate-200"
        autoComplete="off"
      >
        <h1 className="mb-6 text-center text-2xl font-extrabold tracking-tight text-indigo-900">
          CryptoTradeExpress
        </h1>

        <label htmlFor="api_key" className="mb-1 block text-sm font-medium text-slate-700">
          API Key
        </label>
        <div className="mb-4 flex items-center gap-2">
          <input
            id="api_key"
            name="api_key"
            type={showApi ? "text" : "password"}
            value={values.api_key}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Tu API Key"
            inputMode="text"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowApi((s) => !s)}
            className="whitespace-nowrap rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {showApi ? "Ocultar" : "Ver"}
          </button>
        </div>

        <label htmlFor="secret_key" className="mb-1 block text-sm font-medium text-slate-700">
          Secret Key
        </label>
        <div className="mb-6 flex items-center gap-2">
          <input
            id="secret_key"
            name="secret_key"
            type={showSecret ? "text" : "password"}
            value={values.secret_key}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Tu Secret Key"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowSecret((s) => !s)}
            className="whitespace-nowrap rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {showSecret ? "Ocultar" : "Ver"}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {isLoading ? "Activando..." : "Activar API"}
          </button>

          <Link
            to="/perfilPage"
            className="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-800"
          >
            Regresar
          </Link>
        </div>

        <a
          href="https://www.binance.com/es/support/faq/cómo-crear-claves-api-en-binance-360002502072"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block text-sm text-indigo-600 hover:underline"
        >
          ¿No sabes cómo conectarte con Binance?
        </a>
      </form>
    </div>
  );
};

export default APIPage;
