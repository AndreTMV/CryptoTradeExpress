import React, {useState, useEffect} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { reset, seePublicInfo } from "../../features/perfil/perfilSlice";
import { getUserInfo } from "../../features/auth/authSlice";
import { RootState } from "../../app/store";
import { areFriends, removeFriend, sendFriendRequest, friendReset, friendRequestStatus, cancelFriendRequest  } from "../../features/amigos/friendSlice";

const SeeProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const id = useParams()
    const {userInfo } = useSelector((state:RootState) => state.auth)
    const {perfilIsError, perfilIsLoading, perfilIsSuccess, perfilMessage, perfil } = useSelector((state:RootState) => state.perfil)
    const {friendIsError, friendIsLoading, friendIsSuccess, friendMessage, friends } = useSelector((state:RootState) => state.friends)
    const [areFriendsVariable, setAreFriends] = useState<boolean>(false);
    const [friendRequest, setFriendRequest] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getUserInfo())
    }, [])
    

    useEffect(() => {
        const perfilData = {
            id: id.id
        }
        console.log(perfilData)
        dispatch(seePublicInfo(perfilData))

    }, [id])

    useEffect(() => {
        const friendsData = {
            user: userInfo.id,
            see_user: id.id
        }
        console.log(friendsData)
        dispatch( areFriends( friendsData ) ).then(() => setAreFriends(friendMessage.friends))
    }, [userInfo])

    useEffect(() => {
        const friendsData = {
            user: userInfo.id,
            receiver: id.id
        }
        console.log(friendsData)
        dispatch( friendRequestStatus( friendsData ) ).then((response) => setFriendRequest(response.payload.status))
    }, [userInfo])
    
    useEffect(() => {
        if (friendIsError) {
            toast.error(friendMessage);
            toast.error('Ha ocurrido un error, intentelo de nuevo.')
        }

        if (friendIsSuccess && friendIsLoading) {
            navigate("/dashboard")
            toast.success("Se ha realizado la accion correctamente")
        }

        // return () =>
        // {
        //     dispatch(friendReset())
        // }

    }, [friendIsError,friendIsSuccess])

    useEffect(() => {
        if (perfilIsError) {
        toast.error(perfilMessage);
            toast.error('Ha ocurrido un error, intentelo de nuevo.')
        }

        if (perfilIsSuccess) {
            navigate("/dashboard")
            toast.success("Se ha modificado la informacion de tu perfil")
        }
        // return () =>
        // {
        //     dispatch(reset())
        // }
    }, [perfilIsError,perfilIsSuccess])

    useEffect(() => {
        console.log(friendRequest)
    
    }, [friendRequest])

    useEffect(() => {
        console.log(areFriendsVariable)
    
    }, [areFriendsVariable])   

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString();
    };

    const eliminarAmigo = (evt ) => {
        evt.preventDefault()
        const friendsData = {
            user: userInfo.id,
            receiver_id: id.id
        }
        dispatch(removeFriend(friendsData))
        window.location.reload();
    }

    const agregarAmigo = ( evt ) => {
        evt.preventDefault()
        const friendsData = {
            user: userInfo.id,
            receiver_user_id: id.id,
        }
        dispatch(sendFriendRequest(friendsData))
        window.location.reload();
    }

    const cancelarSolicitud = ( evt ) => {
        evt.preventDefault()
        const friendsData = {
            user: userInfo.id,
            receiver_id: id.id,
        }
        dispatch(cancelFriendRequest(friendsData))
        window.location.reload();
    }

    const renderPerfilData = () => {
        return (
            <>
                {perfil.name && (
                    <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Nombre:</label>
                    <p className="text-gray-800">{perfil.name}</p>
                    </div>
                )}
                {perfil.description && (
                    <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Descripción:</label>
                    <p className="text-gray-800">{perfil.description}</p>
                    </div>
                )}
                {perfil.interested_cryptos && (
                    <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Cryptos de interés:</label>
                    <p className="text-gray-800">{perfil.interested_cryptos.join(', ')}</p>
                    </div>
                )}
                {perfil.birth_day && (
                    <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Fecha de nacimiento:</label>
                    <p className="text-gray-800">{formatDate(perfil.birth_day)}</p>
                    </div>
                )}
                {perfil.videos_calification && (
                    <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Calificación promedio de los Videos:</label>
                    <p className="text-gray-800">{perfil.videos_calification}</p>
                    </div>
                )}
                {(perfil.friend_list || perfil.friend_list === 0) && (
                    <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Amigos:</label>
                    <p className="text-gray-800">{perfil.friend_list}</p>
                    </div>
                )}
                {perfil.date_joined && (
                    <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Miembro desde:</label>
                    <p className="text-gray-800">{formatDate(perfil.date_joined)}</p>
                    </div>
                )}
                </>
        );
    };
    return (
        <div className="flex items-center justify-center h-screen mt-6">
            <div className="bg-white p-8 rounded shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">CryptoTradeExpress</h1>
                {perfilIsLoading ? (
                    <p>Cargando...</p>
                    ) : (
                    renderPerfilData()
                )}

                {areFriendsVariable ? (
                    <button
                        type="button"
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3 mr-2"
                        onClick={eliminarAmigo}
                    >
                        Eliminar Amigo
                    </button>
                ) : (
                    friendRequest ? (
                        <button
                            type="button"
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3 mr-2"
                            onClick={cancelarSolicitud}
                        >
                            Cancelar Solicitud
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3 mr-2"
                            onClick={agregarAmigo}
                        >
                            Enviar Solicitud
                        </button>
                    )
                )}
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3">
                <Link to="/dashboard">Regresar</Link>
                </button>
            </div>
        </div>
  );
};

export default SeeProfile