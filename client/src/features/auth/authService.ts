import  axios  from 'axios';

const BACKEND_DOMAIN = "http://localhost:8000"
const REGISTER_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/`
const LOGIN_URL = `${BACKEND_DOMAIN}/api/v1/auth/jwt/create/`
const ACTIVATE_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/activation/`
const RESET_PASSWORD_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password/`
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password_confirm/`
const GET_USER_INFO = `${BACKEND_DOMAIN}/api/v1/auth/users/me/`
const CHECK_USERNAME= `${BACKEND_DOMAIN}/api/v1/auth/checkUsernameInfo/`
const CHECK_EMAIL= `${BACKEND_DOMAIN}/api/v1/auth/checkEmailInfo/`
const SEND_OTP = `${BACKEND_DOMAIN}/api/v1/auth/sendOTP/`
const CHECK_OTP = `${BACKEND_DOMAIN}/api/v1/auth/checkOTP/`
const CHECK_STAFF = `${BACKEND_DOMAIN}/api/v1/auth/isStaff/`
const REMOVE_KEYS = `${BACKEND_DOMAIN}/api/v1/auth/removeKeys/`

const register = async ( userData: any ) =>
{
    const config = {
        headers:{
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(REGISTER_URL, userData, config)
    return response.data
}

const login = async (userData: any) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(LOGIN_URL, userData, config)

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }

    return response.data
}

// Logout 

const logout = () => {
    return localStorage.removeItem("user")
}

// Activate user

const activate = async (userData: any) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(ACTIVATE_URL, userData, config)

    return response.data
}

// Reset Password

const resetPassword = async (userData: any) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(RESET_PASSWORD_URL, userData, config)

    return response.data
}
const resetPasswordConfirm = async (userData: any) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(RESET_PASSWORD_CONFIRM_URL, userData, config)

    return response.data
}

// Get User Info

const getUserInfo = async (accessToken: any) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }

    const response = await axios.get(GET_USER_INFO, config)

    return response.data
}

const checkUserName = async ( userData: any ) =>
{ 
    const config = {
        params: {
            username:userData.username
        }
    }
    const response = await axios.get(CHECK_USERNAME, config)
    return response.data
}

const checkEmail = async ( userData: any ) =>
{ 
    const config = {
        params: {
            email:userData.email
        }
    }
    const response = await axios.get(CHECK_EMAIL, config)
    return response.data
}

const sendOTP = async (userData:any) => {
    const config = {
    headers:{
        "Content-type": "application/json"
        }
    }
    const response = await axios.post( SEND_OTP, userData, config )
    return response.data
}

const checkOTP = async (userData:any) => {
    const config = {
    headers:{
        "Content-type": "application/json"
        }
    }
    const response = await axios.put( CHECK_OTP, userData, config )
    return response.data
}

const checkStaff = async ( userData: any ) =>
{ 
    const config = {
        params: {
            username:userData.username,
       }
    }
    const response = await axios.get(CHECK_STAFF, config)
    return response.data
}

const removeKeys = async ( userData: any ) =>
{
    const config = {
        params: {
            user: userData.id
        }
    }
    const response = await axios.delete(REMOVE_KEYS, config)
    return response.data
}

const authService = {register, login, logout, activate, resetPassword, resetPasswordConfirm, getUserInfo, checkEmail, checkUserName, sendOTP, checkOTP, checkStaff, removeKeys}

export default authService 

  