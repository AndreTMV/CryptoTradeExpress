import  axios  from 'axios';

const BACKEND_DOMAIN = "http://localhost:8000"
const PERFIL_API = `${BACKEND_DOMAIN}/perfil/api/v1/perfil/`
const PERFIL_EXISTS = `${BACKEND_DOMAIN}/perfil/api/v1/perfilExist/`
const PERFIL_INFO = `${BACKEND_DOMAIN}/perfil/api/v1/perfilInfo/`
const HIDE_INFORMATION = `${BACKEND_DOMAIN}/perfil/api/v1/hideInformation/`
const SEE_PUBLIC_INFORMATION = `${BACKEND_DOMAIN}/perfil/api/v1/publicInformation/`
const RECOMENDATIONS = `${BACKEND_DOMAIN}/perfil/api/v1/cosineSimilarity/` 
const EXCLUDE_USER = `${BACKEND_DOMAIN}/perfil/api/v1/excludeUser/` 
const EXCLUDE_USER_LIST = `${BACKEND_DOMAIN}/perfil/api/v1/excludeUserList/` 
const SET_KEYS = `${BACKEND_DOMAIN}/api/v1/auth/setKeys/`
const CHECK_KEYS = `${BACKEND_DOMAIN}/api/v1/auth/checkKeys/`

const createPerfil = async ( perfilData: any ) =>
{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.post(PERFIL_API, perfilData, config)
    return response.data
}

const checkPerfil = async ( perfilData: any ) =>
{
    const config = {
        params: {
            id: perfilData.id,
        }
    }
    const response = await axios.get(PERFIL_EXISTS, config)
    return response.data
}

const perfilInfo = async ( perfilData: any ) =>
{
    const config = {
        params: {
            id: perfilData.id,
        }
    }
    const response = await axios.get(PERFIL_INFO, config)
    return response.data
}

const updatePerfil = async ( perfilData: any) =>
{
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await axios.put(`${PERFIL_API}${perfilData.perfilId}/`,perfilData, config);
    return response.data;
}

const updateHiddenInformation = async ( perfilData: any) =>
{
    const config = {
        params: {
            id: perfilData.username,
            hide_information: perfilData.hideInformation
        }

    }
    const response = await axios.put(HIDE_INFORMATION,null, config);
    return response.data;
}

const getAllPerfils = async () =>
{
    const response = await axios.get( PERFIL_API );
    return response.data
}

const seePublicInfo = async ( perfilData: any ) =>
{
    const config = {
        params: {
            id: perfilData.id,
        }
    }
    const response = await axios.get(SEE_PUBLIC_INFORMATION, config)
    return response.data
}

const fetchRecomendations = async ( perfilData: any ) =>
{
    const config = {
        params: {
            user: perfilData.user,
        }
    }
    const response = await axios.get(RECOMENDATIONS, config)
    return response.data
}

const exlcudeUser = async ( perfilData: any ) =>
{
    const config = {
        headers: {
            'Content-Type':'application/json'
        }
    }
    const response = await axios.put(EXCLUDE_USER,perfilData, config);
    return response.data;
}

const fetchExcludedUsers = async ( perfilData: any ) =>
{
    const config = {
        params: {
            user: perfilData.user,
        }
    }
    const response = await axios.get(EXCLUDE_USER_LIST, config)
    return response.data
}

const setKeys = async ( perfilData: any ) =>
{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.post(SET_KEYS, perfilData, config)
    return response.data
}

const checkKeys = async ( perfilData: any ) =>
{
    const config = {
        params: {
            user: perfilData.user,
        }
    }
    const response = await axios.get(CHECK_KEYS, config)
    return response.data
}

const perfilService = { createPerfil, checkPerfil, perfilInfo, updatePerfil, updateHiddenInformation, getAllPerfils, seePublicInfo, fetchRecomendations, exlcudeUser, fetchExcludedUsers, setKeys, checkKeys }

export default perfilService 