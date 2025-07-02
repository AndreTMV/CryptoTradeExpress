import  axios  from 'axios';

const BACKEND_DOMAIN = "http://localhost:8000"
const CARTERA_API = `${BACKEND_DOMAIN}/cartera/api/v1/getUserInfo/`


const getUserInfo = async ( carteraInfo: any ) =>
{
    const config = {
        params: {
            user: carteraInfo.user
        }
    }
    const response = await axios.get(CARTERA_API, config)
    return response.data
}




const carteraService = { getUserInfo }

export default carteraService