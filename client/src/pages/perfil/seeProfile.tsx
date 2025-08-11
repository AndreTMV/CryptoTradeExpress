import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "../../app/store";
import {
  seePublicInfo,
} from "../../features/perfil/perfilSlice";
import {
  areFriends,
  removeFriend,
  sendFriendRequest,
  friendRequestStatus,
  cancelFriendRequest,
  friendReset,
} from "../../features/amigos/friendSlice";

type PublicPerfil = {
  name?: string;
  description?: string;
  interested_cryptos?: string[];
  birth_day?: string;
  videos_calification?: number;
  friend_list?: number;
  date_joined?: string;
};

const fmtDate = (s?: string) =>
  s ? new Date(s).toLocaleDateString() : "—";

const SeeProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id: paramId } = useParams<{ id: string }>();

  const { userInfo } = useSelector((s: RootState) => s.auth);
  const { perfil: perfilPublico, perfilIsLoading, perfilIsError, perfilMessage } =
    useSelector((s: RootState) => s.perfil);
  const { isLoading: friendLoading, isError: friendError, message: friendMsg } =
    useSelector((s: RootState) => s.friends);

  const [areFriendsState, setAreFriendsState] = React.useState(false);
  const [hasPendingRequest, setHasPendingRequest] = React.useState(false);

  const viewingUserId = React.useMemo(
    () => (paramId ? Number(paramId) : null),
    [paramId]
  );
  const myUserId = userInfo?.id ?? null;
  const isMe = viewingUserId && myUserId && viewingUserId === myUserId;

  React.useEffect(() => {
    if (!viewingUserId) return;

    void dispatch(seePublicInfo({ id: viewingUserId }));
  }, [dispatch, viewingUserId]);

  React.useEffect(() => {
    const run = async () => {
      if (!myUserId || !viewingUserId || isMe) return;

      try {
        const friendsData = { user: myUserId, see_user: viewingUserId };
        const areRes = await dispatch(areFriends(friendsData)).unwrap();
        setAreFriendsState(Boolean(areRes?.friends));

        const reqData = { user: myUserId, receiver: viewingUserId };
        const reqRes = await dispatch(friendRequestStatus(reqData)).unwrap();
        setHasPendingRequest(Boolean(reqRes?.status));
      } catch (err) {
        console.error("Estado de amistad/solicitud no disponible:", err);
      }
    };
    void run();

    return () => {
      dispatch(friendReset());
    };
  }, [dispatch, myUserId, viewingUserId, isMe]);

  React.useEffect(() => {
    if (perfilIsError && perfilMessage) toast.error(perfilMessage);
  }, [perfilIsError, perfilMessage]);

  React.useEffect(() => {
    if (friendError && friendMsg) toast.error(String(friendMsg));
  }, [friendError, friendMsg]);

  const handleRemoveFriend = async () => {
    if (!myUserId || !viewingUserId) return;
    try {
      await dispatch(
        removeFriend({ user: myUserId, receiver_id: viewingUserId })
      ).unwrap();
      setAreFriendsState(false);
      setHasPendingRequest(false);
      toast.success("Amigo eliminado");
    } catch (err) {
      toast.error("No se pudo eliminar al amigo");
      console.error(err);
    }
  };

  const handleSendRequest = async () => {
    if (!myUserId || !viewingUserId) return;
    try {
      await dispatch(
        sendFriendRequest({ user: myUserId, receiver_user_id: viewingUserId })
      ).unwrap();
      setHasPendingRequest(true);
      toast.success("Solicitud enviada");
    } catch (err) {
      toast.error("No se pudo enviar la solicitud");
      console.error(err);
    }
  };

  const handleCancelRequest = async () => {
    if (!myUserId || !viewingUserId) return;
    try {
      await dispatch(
        cancelFriendRequest({ user: myUserId, receiver_id: viewingUserId })
      ).unwrap();
      setHasPendingRequest(false);
      toast.success("Solicitud cancelada");
    } catch (err) {
      toast.error("No se pudo cancelar la solicitud");
      console.error(err);
    }
  };

  if (perfilIsLoading) {
    return (
      <div className="mx-auto mt-24 grid max-w-2xl grid-cols-1 gap-4 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
    );
  }

  const p = (perfilPublico || {}) as PublicPerfil;

  return (
    <div className="mx-auto mt-20 max-w-xl p-4">
      <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-slate-200">
        <h1 className="mb-4 text-center text-2xl font-extrabold tracking-tight text-indigo-900">
          CryptoTradeExpress
        </h1>

        {/* Datos públicos */}
        <div className="space-y-3">
          {p.name && (
            <Item label="Nombre" value={p.name} />
          )}
          {p.description && (
            <Item label="Descripción" value={p.description} />
          )}
          {Array.isArray(p.interested_cryptos) && p.interested_cryptos.length > 0 && (
            <Item
              label="Criptos de interés"
              value={p.interested_cryptos.join(", ")}
            />
          )}
          {"birth_day" in p && (
            <Item label="Fecha de nacimiento" value={fmtDate(p.birth_day)} />
          )}
          {"videos_calification" in p && (
            <Item
              label="Calificación promedio de los videos"
              value={p.videos_calification?.toFixed(2) ?? "—"}
            />
          )}
          {("friend_list" in p) && (
            <Item label="Amigos" value={String(p.friend_list ?? 0)} />
          )}
          {"date_joined" in p && (
            <Item label="Miembro desde" value={fmtDate(p.date_joined)} />
          )}
        </div>

        {/* Acciones de amistad (ocultar si es mi propio perfil) */}
        {!isMe && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {areFriendsState ? (
              <button
                onClick={handleRemoveFriend}
                disabled={friendLoading}
                className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {friendLoading ? "Procesando..." : "Eliminar amigo"}
              </button>
            ) : hasPendingRequest ? (
              <button
                onClick={handleCancelRequest}
                disabled={friendLoading}
                className="rounded-lg bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
              >
                {friendLoading ? "Procesando..." : "Cancelar solicitud"}
              </button>
            ) : (
              <button
                onClick={handleSendRequest}
                disabled={friendLoading}
                className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {friendLoading ? "Procesando..." : "Enviar solicitud"}
              </button>
            )}

            <Link
              to="/dashboard"
              className="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-800"
            >
              Regresar
            </Link>
          </div>
        )}

        {isMe && (
          <div className="mt-6">
            <Link
              to="/dashboard"
              className="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white hover:bg-slate-800"
            >
              Regresar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const Item: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <div className="text-sm font-semibold text-slate-700">{label}</div>
    <div className="text-slate-800">{value}</div>
  </div>
);

export default SeeProfile;
