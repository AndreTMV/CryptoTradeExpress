import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import simuladorService from './simuladorService';

interface SimuladorState {
    simulacion: any;
    preciosBitcoin: any,
    simulacionIsError: boolean;
    simulacionIsSuccess: boolean;
    simulacionIsLoading: boolean;
    simulacionMessage: string;
}

const initialState: SimuladorState = {
    simulacion: {},
    preciosBitcoin: [],
    simulacionIsError: false,
    simulacionIsSuccess: false,
    simulacionIsLoading: false,
    simulacionMessage: '',
};

export const startSimulation = createAsyncThunk(
    "simulacion/startSimulation",
    async (simulacionData: any, thunkAPI) => {
        try {
            return await simuladorService.iniciarSimulacion(simulacionData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const fetchSimulation = createAsyncThunk(
    "simulacion/fetchSimulation",
    async (simulacionData: any, thunkAPI) => {
        try {
            return await simuladorService.obtenerSimulacion(simulacionData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getPredictions = createAsyncThunk(
    "simulacion/getPredictions",
    async (_, thunkAPI) => {
        try {
            return await simuladorService.predecirPrecios();
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getTransactions = createAsyncThunk(
    "simulacion/getTransactions",
    async (simulacionData: any, thunkAPI) => {
        try {
            return await simuladorService.obtenerTransacciones(simulacionData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getBitcoinPrices = createAsyncThunk(
    "simulacion/getBitcoinPrices",
    async (simulationData, thunkAPI) => {
        try {
            return await simuladorService.obtenerPreciosBitcoin(simulationData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const advanceSimulation = createAsyncThunk(
    "simulacion/advanceSimulation",
    async (simulacionData: any, thunkAPI) => {
        try {
            return await simuladorService.avanzarSimulacion(simulacionData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const buyBitcoin = createAsyncThunk(
    "simulacion/buyBitcoin",
    async (simulacionData: any, thunkAPI) => {
        try {
            return await simuladorService.comprarBitcoin(simulacionData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const sellBitcoin = createAsyncThunk(
    "simulacion/sellBitcoin",
    async (simulacionData: any, thunkAPI) => {
        try {
            return await simuladorService.venderBitcoin(simulacionData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const resetSimulation = createAsyncThunk(
    "simulacion/resetSimulation",
    async (simulacionData: any, thunkAPI) => {
        try {
            return await simuladorService.reiniciarSimulacion(simulacionData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateDate = createAsyncThunk(
    "simulacion/updateDate",
    async (simulacionData: any, thunkAPI) => {
        try {
            return await simuladorService.updateDate(simulacionData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const morePredictions = createAsyncThunk(
    "simulacion/morePredictions",
    async (simulacionData: any, thunkAPI) => {
        try {
            return await simuladorService.morePredictions(simulacionData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) ||
                error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const simulacionSlice = createSlice({
    name: "simulation",
    initialState,
    reducers: {
        reset: (state) => {
            state.simulacionIsError = false;
            state.simulacionIsLoading = false;
            state.simulacionIsSuccess = false;
            state.simulacionMessage = '';
        },
        clearPredictions: ( state ) =>
        { 
            state.preciosBitcoin = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPredictions.pending, (state) => {
                state.simulacionIsLoading = true;
            })
            .addCase(getPredictions.fulfilled, (state, action) => {
                state.simulacionIsSuccess = true;
                state.simulacionIsLoading = false;
                state.simulacion = action.payload;
            })
            .addCase(getPredictions.rejected, (state, action) => {
                state.simulacionIsError = true;
                state.simulacionIsLoading = false;
                state.simulacionIsSuccess = false;
                state.simulacionMessage = action.payload;
            })
            .addCase(startSimulation.pending, (state) => {
                state.simulacionIsLoading = true;
            })
            .addCase(startSimulation.fulfilled, (state, action) => {
                state.simulacionIsSuccess = true;
                state.simulacionIsLoading = false;
                state.simulacion = action.payload;
            })
            .addCase(startSimulation.rejected, (state, action) => {
                state.simulacionIsError = true;
                state.simulacionIsLoading = false;
                state.simulacionIsSuccess = false;
                state.simulacionMessage = action.payload;
            })
            .addCase(fetchSimulation.pending, (state) => {
                state.simulacionIsLoading = true;
            })
            .addCase(fetchSimulation.fulfilled, (state, action) => {
                state.simulacionIsSuccess = true;
                state.simulacionIsLoading = false;
                state.simulacion = action.payload;
            })
            .addCase(fetchSimulation.rejected, (state, action) => {
                state.simulacionIsError = true;
                state.simulacionIsLoading = false;
                state.simulacionIsSuccess = false;
                state.simulacionMessage = action.payload;
            })
            .addCase(getTransactions.pending, (state) => {
                state.simulacionIsLoading = true;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.simulacionIsSuccess = true;
                state.simulacionIsLoading = false;
                state.simulacion = action.payload;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.simulacionIsError = true;
                state.simulacionIsLoading = false;
                state.simulacionIsSuccess = false;
                state.simulacionMessage = action.payload;
            })
            .addCase(getBitcoinPrices.pending, (state) => {
                state.simulacionIsLoading = true;
            })
            .addCase(getBitcoinPrices.fulfilled, (state, action) => {
                state.simulacionIsSuccess = true;
                state.simulacionIsLoading = false;
                state.preciosBitcoin = action.payload;
                state.preciosBitcoin.sort((a, b) => {
                    const dateA = new Date(a.fecha);
                    const dateB = new Date(b.fecha);
                    return dateA.getTime() - dateB.getTime();
                });
            })
            .addCase(getBitcoinPrices.rejected, (state, action) => {
                state.simulacionIsError = true;
                state.simulacionIsLoading = false;
                state.simulacionIsSuccess = false;
                state.simulacionMessage = action.payload;
            })
            .addCase(advanceSimulation.pending, (state) => {
                state.simulacionIsLoading = true;
            })
            .addCase(advanceSimulation.fulfilled, (state, action) => {
                state.simulacionIsSuccess = true;
                state.simulacionIsLoading = false;
                state.simulacion = action.payload;
            })
            .addCase(advanceSimulation.rejected, (state, action) => {
                state.simulacionIsError = true;
                state.simulacionIsLoading = false;
                state.simulacionIsSuccess = false;
                state.simulacionMessage = action.payload;
            })
            .addCase(buyBitcoin.pending, (state) => {
                state.simulacionIsLoading = true;
            })
            .addCase(buyBitcoin.fulfilled, (state, action) => {
                state.simulacionIsSuccess = true;
                state.simulacionIsLoading = false;
                state.simulacion = action.payload;
            })
            .addCase(buyBitcoin.rejected, (state, action) => {
                state.simulacionIsError = true;
                state.simulacionIsLoading = false;
                state.simulacionIsSuccess = false;
                state.simulacionMessage = action.payload;
            })
            .addCase(sellBitcoin.pending, (state) => {
                state.simulacionIsLoading = true;
            })
            .addCase(sellBitcoin.fulfilled, (state, action) => {
                state.simulacionIsSuccess = true;
                state.simulacionIsLoading = false;
                state.simulacion = action.payload;
            })
            .addCase(sellBitcoin.rejected, (state, action) => {
                state.simulacionIsError = true;
                state.simulacionIsLoading = false;
                state.simulacionIsSuccess = false;
                state.simulacionMessage = action.payload;
            })
            .addCase(resetSimulation.pending, (state) => {
                state.simulacionIsLoading = true;
            })
            .addCase(resetSimulation.fulfilled, (state, action) => {
                state.simulacionIsSuccess = true;
                state.simulacionIsLoading = false;
                state.simulacion = action.payload;
            })
            .addCase(resetSimulation.rejected, (state, action) => {
                state.simulacionIsError = true;
                state.simulacionIsLoading = false;
                state.simulacionIsSuccess = false;
                state.simulacionMessage = action.payload;
            })
            .addCase(updateDate.pending, (state) => {
                state.simulacionIsLoading = true;
            })
            .addCase(updateDate.fulfilled, (state, action) => {
                state.simulacionIsSuccess = true;
                state.simulacionIsLoading = false;
                state.simulacion = action.payload;
            })
            .addCase(updateDate.rejected, (state, action) => {
                state.simulacionIsError = true;
                state.simulacionIsLoading = false;
                state.simulacionIsSuccess = false;
                state.simulacionMessage = action.payload;
            })
            .addCase(morePredictions.pending, (state) => {
                state.simulacionIsLoading = true;
            })
            .addCase(morePredictions.fulfilled, (state, action) => {
                state.simulacionIsSuccess = true;
                state.simulacionIsLoading = false;
                state.simulacion = action.payload;
            })
            .addCase(morePredictions.rejected, (state, action) => {
                state.simulacionIsError = true;
                state.simulacionIsLoading = false;
                state.simulacionIsSuccess = false;
                state.simulacionMessage = action.payload;
            });
    }
});

export const { reset, clearPredictions } = simulacionSlice.actions;

export default simulacionSlice.reducer;
