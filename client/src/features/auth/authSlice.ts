import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

const user = JSON.parse(localStorage.getItem("user"))

const initialState = {
    userState: user ? user : null,
    userInfo: {},
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
    OTPverified:false,
    logoutState:false,
    isStaff:false
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
			console.log(message)
			return thunkAPI.rejectWithValue(message) 	
		}
	}
)
export const login = createAsyncThunk(
    "auth/login",
    async (userData, thunkAPI) => {
        try {
            return await authService.login(userData)
        } catch (error:any) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const logout = createAsyncThunk(
    "auth/logout",
    async () => {
        authService.logout()
    }
)

export const activate = createAsyncThunk(
    "auth/activate",
    async (userData, thunkAPI) => {
        try {
            return await authService.activate(userData)
        } catch (error:any) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)


export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (userData, thunkAPI) => {
        try {
            return await authService.resetPassword(userData)
        } catch (error:any) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const resetPasswordConfirm = createAsyncThunk(
    "auth/resetPasswordConfirm",
    async (userData, thunkAPI) => {
        try {
            return await authService.resetPasswordConfirm(userData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getUserInfo = createAsyncThunk(
    "auth/getUserInfo",
    async (_, thunkAPI) => {
        try {
            const accessToken = thunkAPI.getState().auth.userState.access
            return await authService.getUserInfo(accessToken)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)
export const checkEmail = createAsyncThunk(
    "auth/checkEmail",
    async (userData, thunkAPI) => {
        try {
            return await authService.checkEmail(userData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)
export const checkUsername = createAsyncThunk(
    "auth/checkUser",
    async (userData, thunkAPI) => {
        try {
            return await authService.checkUserName(userData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const sendOTP = createAsyncThunk(
    "auth/sendOTP",
    async ( userData, thunkAPI ) =>
    {
        try
        {
            await authService.sendOTP(userData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const checkOTP = createAsyncThunk(
    "auth/checkOTP",
    async ( userData, thunkAPI ) =>
    {
        try
        {
            await authService.checkOTP(userData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const checkStaff = createAsyncThunk(
    "auth/checkStaff",
    async ( userData, thunkAPI ) =>
    {
        try
        {
            await authService.checkStaff(userData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const removeKeys = createAsyncThunk(
    "auth/removeKeys",
    async ( userData, thunkAPI ) =>
    {
        try
        {
            await authService.removeKeys(userData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = false
            state.OTPverified = false
            state.isStaff = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.userState = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.userState = null
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.userState = action.payload
                state.logoutState = false
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.userState = null
            })
            .addCase(logout.fulfilled, (state) => {
                state.userState = null
                state.logoutState = false
            })
            .addCase(activate.pending, (state) => {
                state.isLoading = true
            })
            .addCase(activate.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.userState = action.payload
            })
            .addCase(activate.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.userState = null
            })
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.userState = null
            })
            .addCase(resetPasswordConfirm.pending, (state) => {
                state.isLoading = true
            })
            .addCase(resetPasswordConfirm.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(resetPasswordConfirm.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.userState = null
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.userInfo = action.payload
            } )
            .addCase(checkEmail.fulfilled, (state, action) => {
                state.message = action.payload
            } )
            .addCase(checkUsername.fulfilled, (state, action) => {
                state.message = action.payload
            } )
            .addCase(sendOTP.pending, (state) => {
                state.isLoading = true
            })
            .addCase(sendOTP.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(sendOTP.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.userState = null
            })
            .addCase(checkOTP.pending, (state) => {
                state.isLoading = true
            })
            .addCase(checkOTP.fulfilled, (state) => {
                state.isLoading = false
                state.OTPverified = true
                state.logoutState = true
            })
            .addCase(checkOTP.rejected, (state, action) => {
                state.isLoading = false
                state.OTPverified = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(checkStaff.pending, (state) => {
                state.isLoading = true
            })
            .addCase(checkStaff.fulfilled, (state, action) => {
                state.isLoading = false
                state.isStaff = true
                state.logoutState = false
            })
            .addCase(checkStaff.rejected, (state, action) => {
                state.isLoading = false
                state.isStaff = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(removeKeys.pending, (state) => {
                state.isLoading = true
            })
            .addCase(removeKeys.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(removeKeys.rejected, (state, action) => {
                state.isLoading = false
                state.isStaff = false
                state.isError = true
                state.message = action.payload
            })
    }
})
export const { reset } = authSlice.actions

export default authSlice.reducer