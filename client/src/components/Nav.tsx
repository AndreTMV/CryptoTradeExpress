import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { toast } from 'react-hot-toast'

const Nav = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { userState } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate("/")
    }

    return (
            <nav className="bg-gray-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-white text-lg font-semibold">CryptoTradeExpress</h1>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex items-center">
                                {userState ?
                                    <button onClick={handleLogout} className="px-3 py-2 text-white hover:bg-gray-700 rounded-md">Logout</button>
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        )
}

export default Nav