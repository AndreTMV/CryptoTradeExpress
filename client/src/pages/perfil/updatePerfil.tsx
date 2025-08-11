import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { format, parseISO, isValid as isValidDate } from "date-fns";

import type { AppDispatch, RootState } from "../../app/store";
import type { IPerfil } from "../../features/perfil/types";
import { updatePerfil } from "../../features/perfil/perfilSlice";

import Datepicker from "tailwind-datepicker-react";

const datepickerOptions: any = {
  title: "Cumpleaños",
  autoHide: true,
  todayBtn: false,
  clearBtn: true,
  clearBtnText: "Limpiar",
  maxDate: new Date("2007-12-31"),
  minDate: new Date("1962-01-01"),
  theme: {
    background: "bg-white",
    todayBtn: "",
    clearBtn: "",
    icons: "",
    text: "",
    disabledText: "",
    input: "",
    inputIcon: "",
    selected: "",
  },
  datepickerClassNames: "top-12 z-50",
  defaultDate: new Date("1990-01-01"),
  language: "es",
  disabledDates: [],
  weekDays: ["L", "Ma", "Mi", "J", "V", "S", "D"],
  inputPlaceholderProp: "Selecciona fecha",
  inputDateFormatProp: { day: "numeric", month: "long", year: "numeric" },
};

const toISODate = (d: Date | null) => {
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const fmtDate = (value?: string) => {
  if (!value) return "";
  const parsed = parseISO(value);
  return isValidDate(parsed) ? format(parsed, "dd/MM/yyyy") : value;
};

type LocationState = { perfil: IPerfil } | undefined;

export const ActualizarPerfilPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || undefined;
  const perfil = state?.perfil;

  const { isLoading } = useSelector((s: RootState) => s.perfil);

  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [interestedCryptos, setInterestedCryptos] = React.useState<string>(""); // CSV
  const [birthDay, setBirthDay] = React.useState<Date | null>(null);
  const [showBirthDay, setShowBirthDay] = React.useState<boolean>(false);
  const [ready, setReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!perfil) {
      navigate("/dashboard");
      toast.error("No se encontró el perfil a editar.");
      return;
    }
    setName(perfil.name ?? "");
    setDescription(perfil.description ?? "");
    setInterestedCryptos(
      Array.isArray(perfil.interested_cryptos)
        ? perfil.interested_cryptos.join(", ")
        : ""
    );
    if (perfil.birth_day) {
      const p = parseISO(perfil.birth_day);
      if (isValidDate(p)) setBirthDay(p);
    }
    setReady(true);
  }, [perfil, navigate]);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!perfil) return;

    const payload = {
      username: perfil.username,
      perfilId: perfil.id,
      name: name.trim() || perfil.name,
      description: description.trim() || perfil.description,
      interested_cryptos: interestedCryptos.trim()
        ? interestedCryptos.split(",").map((s) => s.trim()).filter(Boolean)
        : perfil.interested_cryptos,
      birth_day: birthDay ? toISODate(birthDay) : perfil.birth_day,
    };

    try {
      await dispatch(updatePerfil(payload)).unwrap();
      toast.success("Perfil actualizado correctamente");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar el perfil. Inténtalo de nuevo.");
    }
  };

  if (!ready) {
    return (
      <div className="mx-auto mt-24 grid max-w-2xl grid-cols-1 gap-4 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 max-w-xl p-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-indigo-900">
          Actualizar Perfil
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Modifica tus datos y guarda los cambios
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200"
      >
        <div>
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Nombre
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={perfil?.name ?? "Tu nombre"}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-indigo-200 focus:ring"
          />
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium text-slate-700">
            Descripción
          </label>
          <input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={perfil?.description ?? "Cuéntanos sobre ti"}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-indigo-200 focus:ring"
          />
        </div>

        <div>
          <label htmlFor="interestedCryptos" className="text-sm font-medium text-slate-700">
            Criptos de interés (separadas por coma)
          </label>
          <input
            id="interestedCryptos"
            value={interestedCryptos}
            onChange={(e) => setInterestedCryptos(e.target.value)}
            placeholder="BTC, ETH, SOL"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-indigo-200 focus:ring"
          />
          {Array.isArray(perfil?.interested_cryptos) && perfil.interested_cryptos.length > 0 && (
            <p className="mt-1 text-xs text-slate-500">
              Actual: {perfil.interested_cryptos.join(", ")}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Fecha de nacimiento
          </label>
          <div className="mt-1">
            <Datepicker
              options={datepickerOptions}
              onChange={(d: Date) => setBirthDay(d)}
              show={showBirthDay}
              setShow={setShowBirthDay}
            />
            <p className="mt-2 text-xs text-slate-600">
              {birthDay
                ? `Seleccionada: ${format(birthDay, "dd/MM/yyyy")}`
                : perfil?.birth_day
                  ? `Actual: ${fmtDate(perfil.birth_day)}`
                  : "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
          >
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </button>

          <Link
            to="/dashboard"
            className="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white shadow hover:bg-slate-800"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ActualizarPerfilPage;
