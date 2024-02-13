import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

const initialState = {
	userState: null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	mesagge: '',
};

export const register = createAsyncThunk(
	"auth/register",
	async ( userData:any, thunkAPI ) =>
	{
		try {
			return await authService.register(userData)	
		} catch (error:any) {
			const message = ( error.response && error.response.data && error.response.data.message )
				|| error.message || error.toString()
			return thunkAPI.rejectWithValue(message) 	
		}
	}
)

export const authSlice = createSlice(
{
	name: 'auth',
	initialState,
	reducers: {
		reset: ( state ) =>
		{
			state.isError = false,
				state.isLoading = false,
				state.isSuccess = false,
				state.message = false
		}
	},
	extraReducers: ( builder ) =>
	{
		builder
			.addCase( register.pending, ( state ) =>
			{
				state.isLoading = true
			} )
			.addCase( register.fulfilled, ( state, action ) =>
			{
				state.isLoading = false
				state.isSuccess = true
				state.userState = action.payload
			} )
			.addCase( register.rejected, ( state, action ) =>
			{
				state.isLoading = false
				state.isSuccess = false
				state.isError = true
				state.message = action.payload
				state.userState = null
			} )
	}
} );

export default authSlice.reducer;
