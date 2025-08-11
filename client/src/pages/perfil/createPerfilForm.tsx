import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { format, parseISO, isValid as isValidDate, isDate } from "date-fns";

import type { RootState, AppDispatch } from "../../app/store";
import type { HideKey, IPerfil } from "../../features/perfil/types";
import {
  createPerfil,
  reset,
  checkPerfil,
  perfilInfo,
  updateHiddenInformation,
} from "../../features/perfil/perfilSlice";

import Datepicker from "tailwind-datepicker-react";

const HIDE_FIELDS: { key: HideKey; label: string }[] = [
  { key: "name", label: "Nombre" },
  { key: "description", label: "Descripción" },
  { key: "interested_cryptos", label: "Criptos de interés" },
  { key: "birth_day", label: "Fecha de nacimiento" },
  { key: "videos_calification", label: "Calificación promedio de videos" },
  { key: "friend_list", label: "Amigos" },
  { key: "date_joined", label: "Miembro desde" },
];

const toISODate = (d: Date | null): string | null => {
  if (!d) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const fmtDate = (value?: string | Date | null) => {
  if (!value) return "—";
  let dateObj: Date;
  if (typeof value === "string") {
    const p = parseISO(value);
    dateObj = isValidDate(p) ? p : new Date(value);
  } else {
    dateObj = value;
  }
  return isDate(dateObj) && isValidDate(dateObj) ? format(dateObj, "dd/MM/yyyy") : "—";
};

const datepickerOptions: any = {
  title: "Cumpleaños",
  autoHide: true,
  todayBtn: false,
  clearBtn: true,
  clearBtnText: "Limpiar",
  maxDate: new Date("2007-01-01"),
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
  weekDays: ["L", "Ma", "Mi", "J", "V", "S", "D"],
  inputPlaceholderProp: "Selecciona fecha",
  inputDateFormatProp: { day: "numeric", month: "long", year: "numeric" },
};

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
    <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
    {children}
  </div>
);

export const CreatePerfilPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { userInfo } = useSelector((s: RootState) => s.auth);
  const { profile, isLoading, isError, isSuccess, message } = useSelector((s: RootState) => s.perfil);

  const [name, setName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [interestedCryptos, setInterestedCryptos] = React.useState<string>(""); // CSV
  const [birthDay, setBirthDay] = React.useState<Date | null>(null);
  const [showBirthDay, setShowBirthDay] = React.useState<boolean>(false);

  const [privacy, setPrivacy] = React.useState<Record<HideKey, boolean>>({
    name: false,
    interested_cryptos: false,
    description: false,
    date_joined: false,
    friend_list: false,
    videos_calification: false,
    birth_day: false,
  });

  const [checking, setChecking] = React.useState(true);
  const [hasProfile, setHasProfile] = React.useState(false);

  React.useEffect(() => {
    const run = async () => {
      try {
        const exists = await dispatch(checkPerfil({ id: userInfo.id })).unwrap();
        setHasProfile(Boolean(exists));
        if (exists) {
          const p = await dispatch(perfilInfo({ id: userInfo.id })).unwrap();
          const next: Record<HideKey, boolean> = { ...privacy };
          HIDE_FIELDS.forEach(({ key }) => {
            next[key] = Array.isArray(p.hide_information) ? p.hide_information.includes(key) : false;
          });
          setPrivacy(next);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    };
    void run();
    return () => {
      dispatch(reset());
    };
  }, [dispatch, userInfo.id]);

  React.useEffect(() => {
    if (isError && message) toast.error(message);
  }, [isError, message]);

  React.useEffect(() => {
    if (isSuccess && !isLoading && !checking) {
      // cuando se crea o actualiza algo
      // no navegamos automáticamente aquí para no romper el flujo de privacidad;
      // sólo en creación enviamos al dashboard (más abajo).
    }
  }, [isSuccess, isLoading, checking]);

  const handleCreate = async () => {
    if (!name.trim() || !description.trim()) {
      toast.error("Nombre y descripción son obligatorios.");
      return;
    }
    try {
      const payload = {
        username: userInfo.id,
        name: name.trim(),
        description: description.trim(),
        interested_cryptos: interestedCryptos
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        birth_day: toISODate(birthDay),
      };
      await dispatch(createPerfil(payload)).unwrap();
      toast.success("Perfil creado");
      navigate("/dashboard");
    } catch (err) {
      toast.error("No se pudo crear el perfil");
      console.error(err);
    }
  };

  const handleSavePrivacy = async () => {
    if (!profile) return;
    try {
      const selected: HideKey[] = HIDE_FIELDS.filter(({ key }) => privacy[key]).map((f) => f.key);
      await dispatch(
        updateHiddenInformation({
          username: profile.username,
          hideInformation: selected,
        })
      ).unwrap();
      toast.success("Privacidad actualizada");
    } catch (err) {
      toast.error("No se pudo actualizar la privacidad");
      console.error(err);
    }
  };

  const togglePrivacy = (key: HideKey) =>
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));

  if (checking) {
    return (
      <div className="mx-auto mt-24 grid max-w-4xl grid-cols-1 gap-4 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
    );
  }

  if (hasProfile && profile) {
    const rows: Array<{
      key: HideKey;
      label: string;
      value: React.ReactNode;
    }> = [
        { key: "name", label: "Nombre", value: profile.name },
        { key: "description", label: "Descripción", value: profile.description },
        {
          key: "interested_cryptos",
          label: "Criptos de interés",
          value: Array.isArray(profile.interested_cryptos)
            ? profile.interested_cryptos.join(", ")
            : "—",
        },
        { key: "birth_day", label: "Fecha de nacimiento", value: fmtDate(profile.birth_day) },
        {
          key: "videos_calification",
          label: "Calificación promedio de videos",
          value:
            typeof profile.videos_calification === "number"
              ? profile.videos_calification.toFixed(2)
              : "—",
        },
        {
          key: "friend_list",
          label: "Amigos",
          value: (profile as IPerfil).friend_list_count ?? 0,
        },
        { key: "date_joined", label: "Miembro desde", value: fmtDate(profile.date_joined) },
      ];

    return (
      <div className="mx-auto mt-24 max-w-4xl p-4">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-indigo-900">
            CryptoTradeExpress
          </h1>
          <p className="mt-1 text-sm text-slate-600">Configuración de privacidad del perfil</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {rows.map(({ key, label, value }) => (
            <div key={key} className="flex items-start justify-between rounded-xl bg-white p-4 shadow ring-1 ring-slate-200">
              <div>
                <p className="text-sm font-medium text-slate-800">{label}</p>
                <p className="mt-1 text-sm text-slate-600">{value ?? "—"}</p>
              </div>
              <label className="inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={Boolean(privacy[key])}
                  onChange={() => togglePrivacy(key)}
                />
                <span className="h-6 w-10 rounded-full bg-slate-300 transition peer-checked:bg-green-500" />
                <span className="-ml-8 size-5 translate-x-0 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
              </label>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow hover:bg-indigo-700"
            onClick={handleSavePrivacy}
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar privacidad"}
          </button>

          <Link
            to="/updatePerfil"
            state={{ perfil: profile }}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700"
          >
            Modificar
          </Link>

          <Link
            to="/API"
            className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white shadow hover:bg-emerald-700"
          >
            Conectar con Binance
          </Link>

          <Link
            to="/dashboard"
            className="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white shadow hover:bg-slate-800"
          >
            Regresar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-24 max-w-xl p-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-indigo-900">
          CryptoTradeExpress
        </h1>
        <p className="mt-1 text-sm text-slate-600">Crea tu perfil</p>
      </div>

      <SectionCard title="Información básica">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
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
              placeholder="Cuéntanos sobre ti"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-indigo-200 focus:ring"
            />
          </div>

          <div>
            <label htmlFor="interested_cryptos" className="text-sm font-medium text-slate-700">
              Criptos de interés (separadas por coma)
            </label>
            <input
              id="interested_cryptos"
              value={interestedCryptos}
              onChange={(e) => setInterestedCryptos(e.target.value)}
              placeholder="BTC, ETH, SOL"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-indigo-200 focus:ring"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Fecha de nacimiento</label>
            <div className="mt-1">
              <Datepicker
                options={datepickerOptions}
                onChange={(d: Date) => setBirthDay(d)}
                show={showBirthDay}
                setShow={setShowBirthDay}
              />
              {birthDay && (
                <p className="mt-2 text-xs text-slate-600">Seleccionada: {fmtDate(birthDay)}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCreate}
            disabled={isLoading}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60"
          >
            {isLoading ? "Creando..." : "Crear"}
          </button>

          <Link
            to="/dashboard"
            className="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white shadow hover:bg-slate-800"
          >
            Regresar
          </Link>
        </div>
      </SectionCard>
    </div>
  );
};

export default CreatePerfilPage;
