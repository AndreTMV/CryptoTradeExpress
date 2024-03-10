import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { toast } from 'react-hot-toast'
import NotificationBell from './notification'
import { IoIosLogOut } from "react-icons/io";


const Nav = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { userState, logoutState, isStaff } = useSelector((state) => state.auth)
    const {notificationCount} = useSelector((state) => state.notifications)

    const handleLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate("/")
    }

    return (
            <nav className="bg-indigo-800 shadow-lg">
                <div className="max-w-full mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-white text-lg font-semibold">CryptoTradeExpress</h1>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex items-center">
                                {(isStaff) ? 
                                    <NotificationBell notificationCount={notificationCount}/>
                                    :
                                    null 
                                }
                            </div>
                            <div className="flex items-center">
                                {(userState && logoutState) ? 
                                   <IoIosLogOut onClick={handleLogout} />
                                    :
                                    null 
                                }
                            </div>
                            <div className="flex items-center">
                                    <button onClick={handleLogout} className="px-3 py-2 text-white hover:bg-gray-700 rounded-md">Salir</button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        )
}

export default Nav