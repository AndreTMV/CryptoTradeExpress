import  axios  from 'axios';

const BACKEND_DOMAIN = "http://localhost:8000"
const COMPRAS_API = `${BACKEND_DOMAIN}/compras/api/v1/compras/`
const SALES = `${BACKEND_DOMAIN}/compras/api/v1/getSales/`
const PURCHASES = `${BACKEND_DOMAIN}/compras/api/v1/getPurchases/`


const fetchSales = async ( comprasData: any ) =>
{
    const config = {
        params: {
            user: comprasData.userId
        }
    }
    const response = await axios.get(SALES, config)
    return response.data
}

const fetchPurchases = async ( comprasData: any ) =>
{
    const config = {
        params: {
            user: comprasData.userId
        }
    }
    const response = await axios.get(PURCHASES, config)
    return response.data
}

const botService = { fetchSales, fetchPurchases }

export default botService 