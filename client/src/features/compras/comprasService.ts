import  axios  from 'axios';

const BACKEND_DOMAIN = "http://localhost:8000"
const COMPRAS_API = `${BACKEND_DOMAIN}/compras/api/v1/compras/`
const GET_TRANSACCIONS = `${BACKEND_DOMAIN}/compras/api/v1/data_transacciones/`
const GRAPH_TWO = `${BACKEND_DOMAIN}/compras/api/v1/transacciones_month/`
const COMPRAR = `${BACKEND_DOMAIN}/compras/api/v1/comprar/`
const VENDER = `${BACKEND_DOMAIN}/compras/api/v1/vender/`
const PLACE_ORDER = `${BACKEND_DOMAIN}/compras/api/v1/buySell/`

const fetchTransacciones = async ( comprasData: any ) =>
{
    const config = {
        params: {
            fecha_inicial: comprasData.fechaInicial,
            fecha_final: comprasData.fechaFinal,
            user: comprasData.userId
        }
    }
    const response = await axios.get(GET_TRANSACCIONS, config)
    return response.data
}

const graphTwo = async ( comprasData: any ) =>
{
    const config = {
        params: {
            fecha_inicial: comprasData.fechaInicial,
            fecha_final: comprasData.fechaFinal,
            user: comprasData.userId
        }
    }
    const response = await axios.get(GRAPH_TWO, config)
    return response.data
}

const comprar = async ( comprasData: any ) =>
{
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }
    const response = await axios.post(COMPRAR, comprasData, config)
    return response.data
}

const vender = async ( comprasData: any ) =>
{
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }
    const response = await axios.post(VENDER, comprasData, config)
    return response.data
}
const buySell = async ( comprasData: any ) =>
{
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }
    const response = await axios.post(PLACE_ORDER, comprasData, config)
    return response.data
}

const comprasService = { fetchTransacciones, graphTwo, comprar, vender, buySell }

export default comprasService 