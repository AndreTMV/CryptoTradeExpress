import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPerfils, fetchRecomendations, excludeUser, fetchExcludedUsers } from "../../features/perfil/perfilSlice";
import { fetchFriends, fetchFriendRequests, declineFriendRequest, acceptFriendRequest } from "../../features/amigos/friendSlice";
import {Link} from "react-router-dom"
import { RootState } from "../../app/store";
import { toast } from 'react-hot-toast';
import { FaCheck, FaTimes } from "react-icons/fa";
import { getUserInfo } from "../../features/auth/authSlice";

interface Perfil {
  perfilData: {
    [id: number]: {
      username: string,
      similarity: number
    }
  }
}

interface Friend {
  id:number
  friend: string;
  is_mutual_friend: string;
}

interface FriendRequest {
  id: number;
  sender_username: string;
  receiver: number
}

const PerfilList: React.FC<{ perfiles: Perfil[], userInfo:any, excludedUsers: Array<number>}> = ({ perfiles, userInfo, excludedUsers}) => {
  const dispatch = useDispatch()
  return (
    <div className="flex flex-col pr-4">
      <h2 className="text-xl font-bold mb-4">Recomendaciones</h2>
      <ul>
      {perfiles
            .filter((perfil) => perfil.similarity >= 0.8 && !excludedUsers.includes(perfil.id))
            .map((perfil) => (
              <li key={perfil.id} className="mb-2 flex items-center">
                <Link to={`/seeProfile/${perfil.id}`}>
                  {perfil.username}
                </Link>
                <button className="ml-auto" onClick={() => handleExclude(userInfo, perfil.id, dispatch)}>
                  <FaTimes />
                </button>
              </li>
            ))}
      </ul>
    </div>
  )
};

const FriendList: React.FC<{ friends: Friend[]}> = ({ friends }) => (
  <div className="flex flex-col pr-4">
    <h2 className="text-xl font-bold mb-4">Tus amigos</h2>
    {friends.length === 0 ? 
      <h3 className="font-bold mb-4">No tienes amigos todavia</h3>
    : 
     <ul>
      {friends.map((friend) => (
        <li key={friend.id} className="mb-2">
          <Link to={`/seeProfile/${friend.id}`}>{friend.friend}</Link>
        </li>
      ))}
    </ul>   
    }

  </div>
);
const handleAccept = (request: FriendRequest, dispatch:any) => {
  const friendsData = {
    user: request.receiver,
    friend_request: request.id
  }
  dispatch(acceptFriendRequest(friendsData))
  window.location.reload();
};

const handleDecline = (request: FriendRequest, dispatch:any) => {
  const friendsData = {
    user: request.receiver,
    friend_request: request.id
  }
  dispatch(declineFriendRequest(friendsData))
  window.location.reload();
};

const handleExclude = (userInfo: any, exclude: number, dispatch:any) => {
  const friendsData = {
    user: userInfo.id,
    exclude: exclude
  }
  dispatch(excludeUser(friendsData))
  window.location.reload();
};

const FriendRequestList: React.FC<{ requests: FriendRequest[] }> = ({ requests }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col pr-4">
      <h2 className="text-xl font-bold mb-4">Tus Solicitudes</h2>
      {requests.status === "no friend requests" ? (
        <h3 className="font-bold mb-4">No tienes solicitudes</h3>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request.id} className="mb-2">
              <span>{request.sender_username}</span>
              <button className="ml-2" onClick={() => handleAccept(request, dispatch)}> 
                <FaCheck />
              </button>
              <button className="ml-2" onClick={() => handleDecline(request, dispatch)}> 
                <FaTimes />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FriendHomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { perfil } = useSelector((state:RootState) => state.perfil);
  const { userInfo } = useSelector((state:RootState) => state.auth);
  const {friends} = useSelector((state:RootState) => state.friends);
  const [perfiles, setPerfiles] = useState<Perfil[]>([])
  const [friendsList, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendsRequests] = useState<FriendRequest[]>([])
  const [excludedUsers, setExcludedUsers] = useState([])

  useEffect(() => {
    dispatch(getUserInfo())
  
  }, [])
  

  useEffect(() => {
    const perfilData = {
      user: userInfo.id
    }
    dispatch( fetchRecomendations(perfilData) )
    .then( ( response ) =>
    {
      if (response.payload) {
        const perfilesArreglo = Object.entries(response.payload).map(([id, perfil]) => ({
          id: parseInt(id), // Convertir el id a número
          ...perfil // Propiedades username y similarity
        }));
        setPerfiles(perfilesArreglo);
      }
    }).catch((error) => {
        console.error("Error fetching perfiles:", error);
        toast.error('Ha ocurrido un error al cargar los datos');
    });;


  },[userInfo] )

  useEffect(() => {
    const id = userInfo.id;
    const friendsData = {
      user: id
    }

   dispatch( fetchExcludedUsers(friendsData) )
    .then( ( response ) =>
    {
      if ( response.payload )
      {
        setExcludedUsers( response.payload)
      }
      
    }).catch((error) => {
        console.error("Error fetching excluded users:", error);
        toast.error('Ha ocurrido un error al cargar los datos');
    });
  }, [userInfo])

  useEffect(() => {
    const id = userInfo.id;
    const friendsData = {
      user: id,
      see_user: id
    }

   dispatch( fetchFriends(friendsData) )
    .then( ( response ) =>
    {
      if ( response.payload )
      {
        setFriends( response.payload)
      }
      
    }).catch((error) => {
        console.error("Error fetching perfiles:", error);
        toast.error('Ha ocurrido un error al cargar los datos');
    });;
  }, [userInfo])

  useEffect(() => {
    const id = userInfo.id;
    const friendsData = {
      user: id,
    }

   dispatch( fetchFriendRequests(friendsData) )
    .then( ( response ) =>
    {
      if ( response.payload )
      {
        setFriendsRequests( response.payload)
      }
      
    }).catch((error) => {
        console.error("Error fetching perfiles:", error);
        toast.error('Ha ocurrido un error al cargar los datos');
    });;
  }, [userInfo])
  
  useEffect(() => {

    const perfilesFiltrados = perfiles.filter(perfil => !friendsList.some(friend => friend.id === perfil.id));
    // Verificar si hay cambios antes de actualizar el estado
    if (JSON.stringify(perfilesFiltrados) !== JSON.stringify(perfiles)) {
      // Actualizar el estado de los perfiles con los perfiles filtrados
      setPerfiles(perfilesFiltrados);
    }

  }, [ perfiles, friendsList]);

  useEffect(() => {
    console.log(excludedUsers)
  
  }, [excludedUsers])
  

  return (
    <div className="flex items-center justify-center h-screen">
        {perfiles.length == 0 ? (
            <p>Cargando...</p>
            ) : (
            <>
            <PerfilList perfiles={perfiles} userInfo={userInfo} excludedUsers={excludedUsers}/>
            <FriendList friends={friendsList}/>
            <FriendRequestList requests={friendRequests}/>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
              <Link to="/dashboard">Regresar</Link>
              </button>
              </>
          )}
        </div>
    );
};

export default FriendHomePage;