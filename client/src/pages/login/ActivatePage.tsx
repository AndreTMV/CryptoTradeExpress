import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { activate, reset } from '../../features/auth/authSlice'
import Spinner from '../../components/Spinner'
export function ActivationPage() {

      const { uid, token } = useParams()
      const dispatch = useDispatch()
      const navigate = useNavigate()

      const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

      const handleSubmit = (e:any) => {
          e.preventDefault()

          const userData = {
              uid,
              token
          }
          dispatch(activate(userData))
          toast.success("Tu cuenta ha sido creada! Ya puedes iniciar sesion.")
      }

      useEffect(() => {
          if (isError) {
              toast.error(message)
          }

          if (isSuccess) {
              navigate("/")
          }

          dispatch(reset())

      }, [isError, isSuccess, navigate, dispatch])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">
        Activar Cuenta
      </h1>
      {isLoading && <Spinner />}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded"
        onClick={handleSubmit}
      >
        Activar Cuenta
      </button>
    </div>
  );
}