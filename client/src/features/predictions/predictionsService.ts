import  axios  from 'axios';

const BACKEND_DOMAIN = "http://localhost:8000"
const PREDICTIONS_API = `${BACKEND_DOMAIN}/predictions/api/v1/`
const GET_GRYPTOS = `${BACKEND_DOMAIN}/predictions/api/v1/getCryptos/`
const GRAPH_PREDICTION = `${BACKEND_DOMAIN}/predictions/api/v1/sendGraphData/`
const LAST_10_DAYS = `${BACKEND_DOMAIN}/predictions/api/v1/sendGraphDataLast/`

const getCryptos = async (  ) =>
{

    const response = await axios.get(GET_GRYPTOS,)
    return response.data
}

const graphPrediction = async ( cryptoData:any  ) =>
{
    console.log(cryptoData.crypto)
    const config = {
        params: {
            crypto:cryptoData.crypto
        }
    }
    const response = await axios.get(GRAPH_PREDICTION,config)
    return response.data
}

const graphLast10Days = async ( cryptoData:any  ) =>
{
    console.log(cryptoData.crypto)
    const config = {
        params: {
            crypto:cryptoData.crypto
        }
    }
    const response = await axios.get(LAST_10_DAYS,config)
    return response.data
}

const predictionsService = { getCryptos, graphPrediction, graphLast10Days }

export default predictionsService 
