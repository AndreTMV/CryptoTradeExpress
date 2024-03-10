import  axios  from 'axios';

const BACKEND_DOMAIN = "http://localhost:8000"
const PERFIL_API = `${BACKEND_DOMAIN}/perfil/api/v1/perfil/`

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

const perfilService = { createPerfil }

export default perfilService 

