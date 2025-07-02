import  axios  from 'axios';

const BACKEND_DOMAIN = "http://localhost:8000"
const PRICES_API = `${BACKEND_DOMAIN}/prices/api/v1/prices/`


const createPriceAlert = async ( priceData: any ) =>
{
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const response = await axios.post(PRICES_API, priceData, config)
    return response.data
}




const priceService = { createPriceAlert }

export default priceService 



