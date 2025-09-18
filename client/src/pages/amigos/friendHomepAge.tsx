//import React, { useEffect, useState } from "react";
//import { useDispatch, useSelector } from "react-redux";
//import { getAllPerfils, fetchRecomendations, excludeUser, fetchExcludedUsers } from "../../features/perfil/perfilSlice";
//import { fetchFriends, fetchFriendRequests, declineFriendRequest, acceptFriendRequest } from "../../features/amigos/friendSlice";
//import {Link} from "react-router-dom"
//import { RootState } from "../../app/store";
//import { toast } from 'react-hot-toast';
//import { FaCheck, FaTimes } from "react-icons/fa";
//import { getUserInfo } from "../../features/auth/authSlice";
//
//interface Perfil {
//  perfilData: {
//    [id: number]: {
//      username: string,
//      similarity: number
//    }
//  }
//}
//
//interface Friend {
//  id:number
//  friend: string;
//  is_mutual_friend: string;
//}
//
//interface FriendRequest {
//  id: number;
//  sender_username: string;
//  receiver: number
//}
//
//const PerfilList: React.FC<{ perfiles: Perfil[], userInfo:any, excludedUsers: Array<number>}> = ({ perfiles, userInfo, excludedUsers}) => {
//  const dispatch = useDispatch()
//  return (
//    <div className="flex flex-col pr-4">
//      <h2 className="text-xl font-bold mb-4">Recomendaciones</h2>
//      <ul>
//      {perfiles
//            .filter((perfil) => perfil.similarity >= 0.8 && !excludedUsers.includes(perfil.id))
//            .map((perfil) => (
//              <li key={perfil.id} className="mb-2 flex items-center">
//                <Link to={`/seeProfile/${perfil.id}`}>
//                  {perfil.username}
//                </Link>
//                <button className="ml-auto" onClick={() => handleExclude(userInfo, perfil.id, dispatch)}>
//                  <FaTimes />
//                </button>
//              </li>
//            ))}
//      </ul>
//    </div>
//  )
//};
//
//const FriendList: React.FC<{ friends: Friend[]}> = ({ friends }) => (
//  <div className="flex flex-col pr-4">
//    <h2 className="text-xl font-bold mb-4">Tus amigos</h2>
//    {friends.length === 0 ? 
//      <h3 className="font-bold mb-4">No tienes amigos todavia</h3>
//    : 
//     <ul>
//      {friends.map((friend) => (
//        <li key={friend.id} className="mb-2">
//          <Link to={`/seeProfile/${friend.id}`}>{friend.friend}</Link>
//        </li>
//      ))}
//    </ul>   
//    }
//
//  </div>
//);
//const handleAccept = (request: FriendRequest, dispatch:any) => {
//  const friendsData = {
//    user: request.receiver,
//    friend_request: request.id
//  }
//  dispatch(acceptFriendRequest(friendsData))
//  window.location.reload();
//};
//
//const handleDecline = (request: FriendRequest, dispatch:any) => {
//  const friendsData = {
//    user: request.receiver,
//    friend_request: request.id
//  }
//  dispatch(declineFriendRequest(friendsData))
//  window.location.reload();
//};
//
//const handleExclude = (userInfo: any, exclude: number, dispatch:any) => {
//  const friendsData = {
//    user: userInfo.id,
//    exclude: exclude
//  }
//  dispatch(excludeUser(friendsData))
//  window.location.reload();
//};
//
//const FriendRequestList: React.FC<{ requests: FriendRequest[] }> = ({ requests }) => {
//  const dispatch = useDispatch();
//
//  return (
//    <div className="flex flex-col pr-4">
//      <h2 className="text-xl font-bold mb-4">Tus Solicitudes</h2>
//      {requests.status === "no friend requests" ? (
//        <h3 className="font-bold mb-4">No tienes solicitudes</h3>
//      ) : (
//        <ul>
//          {requests.map((request) => (
//            <li key={request.id} className="mb-2">
//              <span>{request.sender_username}</span>
//              <button className="ml-2" onClick={() => handleAccept(request, dispatch)}> 
//                <FaCheck />
//              </button>
//              <button className="ml-2" onClick={() => handleDecline(request, dispatch)}> 
//                <FaTimes />
//              </button>
//            </li>
//          ))}
//        </ul>
//      )}
//    </div>
//  );
//};
//
//const FriendHomePage: React.FC = () => {
//  const dispatch = useDispatch();
//  const { perfil } = useSelector((state:RootState) => state.perfil);
//  const { userInfo } = useSelector((state:RootState) => state.auth);
//  const {friends} = useSelector((state:RootState) => state.friends);
//  const [perfiles, setPerfiles] = useState<Perfil[]>([])
//  const [friendsList, setFriends] = useState<Friend[]>([])
//  const [friendRequests, setFriendsRequests] = useState<FriendRequest[]>([])
//  const [excludedUsers, setExcludedUsers] = useState([])
//
//  useEffect(() => {
//    dispatch(getUserInfo())
//
//  }, [])
//
//
//  useEffect(() => {
//    const perfilData = {
//      user: userInfo.id
//    }
//    dispatch( fetchRecomendations(perfilData) )
//    .then( ( response ) =>
//    {
//      if (response.payload) {
//        const perfilesArreglo = Object.entries(response.payload).map(([id, perfil]) => ({
//          id: parseInt(id), // Convertir el id a número
//          ...perfil // Propiedades username y similarity
//        }));
//        setPerfiles(perfilesArreglo);
//      }
//    }).catch((error) => {
//        console.error("Error fetching perfiles:", error);
//        toast.error('Ha ocurrido un error al cargar los datos');
//    });;
//
//
//  },[userInfo] )
//
//  useEffect(() => {
//    const id = userInfo.id;
//    const friendsData = {
//      user: id
//    }
//
//   dispatch( fetchExcludedUsers(friendsData) )
//    .then( ( response ) =>
//    {
//      if ( response.payload )
//      {
//        setExcludedUsers( response.payload)
//      }
//
//    }).catch((error) => {
//        console.error("Error fetching excluded users:", error);
//        toast.error('Ha ocurrido un error al cargar los datos');
//    });
//  }, [userInfo])
//
//  useEffect(() => {
//    const id = userInfo.id;
//    const friendsData = {
//      user: id,
//      see_user: id
//    }
//
//   dispatch( fetchFriends(friendsData) )
//    .then( ( response ) =>
//    {
//      if ( response.payload )
//      {
//        setFriends( response.payload)
//      }
//
//    }).catch((error) => {
//        console.error("Error fetching perfiles:", error);
//        toast.error('Ha ocurrido un error al cargar los datos');
//    });;
//  }, [userInfo])
//
//  useEffect(() => {
//    const id = userInfo.id;
//    const friendsData = {
//      user: id,
//    }
//
//   dispatch( fetchFriendRequests(friendsData) )
//    .then( ( response ) =>
//    {
//      if ( response.payload )
//      {
//        setFriendsRequests( response.payload)
//      }
//
//    }).catch((error) => {
//        console.error("Error fetching perfiles:", error);
//        toast.error('Ha ocurrido un error al cargar los datos');
//    });;
//  }, [userInfo])
//
//  useEffect(() => {
//
//    const perfilesFiltrados = perfiles.filter(perfil => !friendsList.some(friend => friend.id === perfil.id));
//    // Verificar si hay cambios antes de actualizar el estado
//    if (JSON.stringify(perfilesFiltrados) !== JSON.stringify(perfiles)) {
//      // Actualizar el estado de los perfiles con los perfiles filtrados
//      setPerfiles(perfilesFiltrados);
//    }
//
//  }, [ perfiles, friendsList]);
//
//  useEffect(() => {
//    console.log(excludedUsers)
//
//  }, [excludedUsers])
//
//
//  return (
//    <div className="flex items-center justify-center h-screen">
//        {perfiles.length == 0 ? (
//            <p>Cargando...</p>
//            ) : (
//            <>
//            <PerfilList perfiles={perfiles} userInfo={userInfo} excludedUsers={excludedUsers}/>
//            <FriendList friends={friendsList}/>
//            <FriendRequestList requests={friendRequests}/>
//              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
//              <Link to="/dashboard">Regresar</Link>
//              </button>
//              </>
//          )}
//        </div>
//    );
//};
//
//export default FriendHomePage;
//
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import {
  fetchRecomendations,
  fetchExcludedUsers,
  excludeUser,
} from "../../features/perfil/perfilSlice";
import {
  fetchFriends,
  fetchFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
} from "../../features/amigos/friendSlice";
import { getUserInfo } from "../../features/auth/authSlice";
import { toast } from "react-hot-toast";
import { FaCheck, FaTimes, FaUserPlus, FaUserFriends } from "react-icons/fa";

// === Tipos locales para esta vista ===
interface RecommendationItem {
  id: number;
  username: string;
  similarity: number;
}

interface FriendItem {
  id: number;
  friend: string; // username
  is_mutual_friend: boolean;
}

interface FriendRequestItem {
  id: number;
  sender_username: string;
  receiver: number; // user id (receptor)
}

const SIMILARITY_THRESHOLD = 0.8;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-black/5">
      <h2 className="mb-4 text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
      ))}
    </ul>
  );
}

function Btn({
  onClick,
  title,
  children,
  disabled,
}: {
  onClick?: () => void;
  title?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export default function FriendsDashboard() {
  const dispatch = useDispatch<AppDispatch>();

  // ==== store selectors ====
  const user = useSelector((s: RootState) => s.auth.userInfo);
  const userId = user?.id;

  const friendsList = useSelector((s: RootState) => s.friends.friends) as FriendItem[];
  const friendRequests = useSelector((s: RootState) => s.friends.requests) as FriendRequestItem[];

  const perfilLoading = useSelector((s: RootState) => s.perfil.isLoading);
  const friendsLoading = useSelector((s: RootState) => s.friends.isLoading);

  // Estado local para recomendaciones / excluidos
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [excludedUsers, setExcludedUsers] = useState<number[]>([]);
  const [actingId, setActingId] = useState<number | null>(null); // para deshabilitar botones durante acciones

  // Cargar userInfo si aún no está
  useEffect(() => {
    if (!userId) dispatch(getUserInfo());
  }, [userId, dispatch]);

  // Cargar datos principales en paralelo cuando hay userId
  useEffect(() => {
    if (!userId) return;

    // Recomendaciones (Similarities dict -> array)
    dispatch(fetchRecomendations({ user: userId }))
      .unwrap()
      .then((similarities: Record<number, { username: string; similarity: number }>) => {
        const arr = Object.entries(similarities || {})
          .map(([id, v]) => ({ id: Number(id), username: v.username, similarity: v.similarity }))
          .sort((a, b) => b.similarity - a.similarity);
        setRecommendations(arr);
      })
      .catch((e) => {
        console.error(e);
        toast.error("No se pudieron cargar recomendaciones");
      });

    // Amigos propios
    dispatch(fetchFriends({ user: userId, see_user: userId }))
      .unwrap()
      .catch(() => { });

    // Solicitudes entrantes
    dispatch(fetchFriendRequests({ user: userId }))
      .unwrap()
      .catch(() => { });

    // Excluidos
    dispatch(fetchExcludedUsers({ user: userId }))
      .unwrap()
      .then((ids) => setExcludedUsers(ids || []))
      .catch(() => { });
  }, [userId, dispatch]);

  // Filtrar recomendaciones por similitud, excluidos y amigos existentes
  const filteredRecommendations = useMemo(() => {
    if (!recommendations?.length) return [] as RecommendationItem[];
    const friendIds = new Set(friendsList?.map((f) => f.id));
    const excluded = new Set(excludedUsers);
    return recommendations.filter(
      (r) => r.similarity >= SIMILARITY_THRESHOLD && !friendIds.has(r.id) && !excluded.has(r.id)
    );
  }, [recommendations, friendsList, excludedUsers]);

  // ==== handlers
  const onAccept = useCallback(
    async (req: FriendRequestItem) => {
      try {
        setActingId(req.id);
        await dispatch(acceptFriendRequest({ user: req.receiver, friend_request: req.id })).unwrap();
        toast.success("Solicitud aceptada");
        // refrescar listas relevantes
        if (userId) {
          dispatch(fetchFriends({ user: userId, see_user: userId }));
          dispatch(fetchFriendRequests({ user: userId }));
        }
      } catch (e: any) {
        toast.error(e?.message || "No se pudo aceptar");
      } finally {
        setActingId(null);
      }
    },
    [dispatch, userId]
  );

  const onDecline = useCallback(
    async (req: FriendRequestItem) => {
      try {
        setActingId(req.id);
        await dispatch(declineFriendRequest({ user: req.receiver, friend_request: req.id })).unwrap();
        toast.success("Solicitud rechazada");
        if (userId) dispatch(fetchFriendRequests({ user: userId }));
      } catch (e: any) {
        toast.error(e?.message || "No se pudo rechazar");
      } finally {
        setActingId(null);
      }
    },
    [dispatch, userId]
  );

  const onExclude = useCallback(
    async (targetUserId: number) => {
      if (!userId) return;
      try {
        setActingId(targetUserId);
        await dispatch(excludeUser({ user: userId, exclude: targetUserId })).unwrap();
        toast.success("Usuario ocultado de recomendaciones");
        setExcludedUsers((prev) => Array.from(new Set([...prev, targetUserId])));
      } catch (e: any) {
        toast.error(e?.message || "No se pudo excluir");
      } finally {
        setActingId(null);
      }
    },
    [dispatch, userId]
  );

  const loadingAll = (perfilLoading || friendsLoading) && !userId;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-indigo-900">Conecta con personas</h1>
          <p className="text-sm text-gray-500">Administra tus amigos, solicitudes y recomendaciones.</p>
        </div>
        <Link
          to="/dashboard"
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500"
        >
          Volver al dashboard
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-6 text-black md:grid-cols-2 lg:grid-cols-3">
        {/* Recomendaciones */}
        <Section title="Recomendaciones">
          {!userId || loadingAll ? (
            <SkeletonList rows={5} />
          ) : filteredRecommendations.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
              No hay recomendaciones (o ya excluiste a todas).
              <div className="mt-2">Consejo: completa tu perfil para mejorar las sugerencias.</div>
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredRecommendations.map((p) => (
                <li key={p.id} className="flex items-center gap-3 rounded-lg border p-3 text-gray-500">
                  <FaUserPlus className="shrink-0" />
                  <Link
                    to={`/seeProfile/${p.id}`}
                    className="line-clamp-1 font-medium hover:underline"
                    title={p.username}
                  >
                    {p.username}
                  </Link>
                  <span className="ml-auto text-xs text-gray-500">similitud {(p.similarity * 100).toFixed(0)}%</span>
                  <Btn onClick={() => onExclude(p.id)} title="Ocultar" disabled={actingId === p.id}>
                    <FaTimes />
                  </Btn>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Amigos */}
        <Section title="Tus amigos">
          {!userId || friendsLoading ? (
            <SkeletonList rows={5} />
          ) : !friendsList || friendsList.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
              Aún no tienes amigos. Explora perfiles y envía solicitudes.
            </div>
          ) : (
            <ul className="space-y-2">
              {friendsList.map((f) => (
                <li key={f.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <FaUserFriends className="shrink-0" />
                  <Link to={`/seeProfile/${f.id}`} className="font-medium hover:underline">
                    {f.friend}
                  </Link>
                  {f.is_mutual_friend && (
                    <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 ring-1 ring-inset ring-emerald-200">
                      amigos en común
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Solicitudes */}
        <Section title="Tus solicitudes">
          {!userId || friendsLoading ? (
            <SkeletonList rows={4} />
          ) : !friendRequests || friendRequests.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
              No tienes solicitudes pendientes.
            </div>
          ) : (
            <ul className="space-y-2">
              {friendRequests.map((req) => (
                <li key={req.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <span className="font-medium text-gray-500">{req.sender_username}</span>
                  <div className="ml-auto flex items-center gap-2">
                    <Btn onClick={() => onAccept(req)} title="Aceptar" disabled={actingId === req.id}>
                      <FaCheck />
                    </Btn>
                    <Btn onClick={() => onDecline(req)} title="Rechazar" disabled={actingId === req.id}>
                      <FaTimes />
                    </Btn>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}
