import  axios  from 'axios';

const BACKEND_DOMAIN = "http://localhost:8000";
const FETCH_SIMULACION = `${BACKEND_DOMAIN}/simulador/api/v1/simulacion/`;
const FETCH_TRANSACCIONES = `${BACKEND_DOMAIN}/simulador/api/v1/transacciones/`;
const FETCH_PRECIOS_BITCOIN = `${BACKEND_DOMAIN}/simulador/api/v1/precios/`;
const START_SIMULATION = `${BACKEND_DOMAIN}/simulador/api/v1/iniciar/`;
const AVANZAR_API = `${BACKEND_DOMAIN}/simulador/api/v1/avanzar/`;
const COMPRAR_API = `${BACKEND_DOMAIN}/simulador/api/v1/comprar/`;
const VENDER_API = `${BACKEND_DOMAIN}/simulador/api/v1/vender/`;
const REINICIAR_API = `${BACKEND_DOMAIN}/simulador/api/v1/reiniciar/`;
const PREDECIR_API = `${BACKEND_DOMAIN}/simulador/api/v1/predicciones/`;
const UPDATE_DATE = `${BACKEND_DOMAIN}/simulador/api/v1/actualizar_fecha/`;
const MORE_PREDICTIONS = `${BACKEND_DOMAIN}/simulador/api/v1/more_predictions/`;

const obtenerSimulacion = async (simulationData:any) => {
    const config = {
        params: {
            user:simulationData.user
        }
    }
    const response = await axios.get(FETCH_SIMULACION, config)
    return response.data
};

const obtenerTransacciones = async (simulationData:any) => {
    const config = {
        params: {
            user:simulationData.user
        }
    }
    const response = await axios.get(FETCH_TRANSACCIONES, config);
    return response.data;
};

const obtenerPreciosBitcoin = async (simulationData:any) => {
    const config = {
        params: {
            user:simulationData.user
        }
    }
    const response = await axios.get(FETCH_PRECIOS_BITCOIN, config);
    return response.data;
};

const iniciarSimulacion = async (simulacionData:any) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = await axios.post(START_SIMULATION, simulacionData, config);
    return response.data;
};

const avanzarSimulacion = async (simulacionData:any) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = await axios.post(AVANZAR_API, simulacionData, config);
    return response.data;
};

const comprarBitcoin = async (simulacionData: any) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = await axios.post(COMPRAR_API, simulacionData, config);
    return response.data;
};

const venderBitcoin = async (simulacionData: any) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        },
    };
    const response = await axios.post(VENDER_API, simulacionData, config);
    return response.data;
};

const reiniciarSimulacion = async (simulacionData:any) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        },
    };
    const response = await axios.post(REINICIAR_API, simulacionData, config);
    return response.data;
};

const predecirPrecios = async () => {
    const response = await axios.get(PREDECIR_API);
    return response.data;
};

const updateDate = async (simulacionData:any) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = await axios.put(UPDATE_DATE, simulacionData, config);
    return response.data;
};

const morePredictions = async (simulacionData:any) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = await axios.post(MORE_PREDICTIONS, simulacionData, config);
    return response.data;
};
const simuladorService = {
    obtenerSimulacion,
    obtenerTransacciones,
    obtenerPreciosBitcoin,
    iniciarSimulacion,
    avanzarSimulacion,
    comprarBitcoin,
    venderBitcoin,
    reiniciarSimulacion,
    predecirPrecios,
    updateDate,
    morePredictions
};

export default simuladorService;
