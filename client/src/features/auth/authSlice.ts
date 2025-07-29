import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from './authService';
import { IUser, IRegisterPayload, ILoginPayload, IOTPRequest, IOTPCheck, AuthState } from './types';

const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;

const initialState: AuthState = {
  userState: user,
  userInfo: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  OTPverified: false,
  logoutState: false,
  isStaff: false,
};

export const register = createAsyncThunk<IUser, IRegisterPayload, { rejectValue: string }>(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk<IUser, ILoginPayload, { rejectValue: string }>(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk<void, void>(
  "auth/logout",
  async () => {
    authService.logout();
  }
);

export const activate = createAsyncThunk<any, { uid: string; token: string }, { rejectValue: string }>(
  "auth/activate",
  async (userData, thunkAPI) => {
    try {
      return await authService.activate(userData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk<any, { email: string }, { rejectValue: string }>(
  "auth/resetPassword",
  async (userData, thunkAPI) => {
    try {
      return await authService.resetPassword(userData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetPasswordConfirm = createAsyncThunk<any, { uid: string; token: string; new_password: string }, { rejectValue: string }>(
  "auth/resetPasswordConfirm",
  async (userData, thunkAPI) => {
    try {
      return await authService.resetPasswordConfirm(userData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserInfo = createAsyncThunk<IUser, void, { rejectValue: string, state: { auth: AuthState } }>(
  "auth/getUserInfo",
  async (_, thunkAPI) => {
    try {
      const accessToken = thunkAPI.getState().auth.userState?.access as string;
      return await authService.getUserInfo(accessToken);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const sendOTP = createAsyncThunk<any, IOTPRequest, { rejectValue: string }>(
  "auth/sendOTP",
  async (userData, thunkAPI) => {
    try {
      return await authService.sendOTP(userData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const checkOTP = createAsyncThunk<any, IOTPCheck, { rejectValue: string }>(
  "auth/checkOTP",
  async (userData, thunkAPI) => {
    try {
      return await authService.checkOTP(userData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const checkStaff = createAsyncThunk<boolean, { username: string }, { rejectValue: string }>(
  "auth/checkStaff",
  async (userData, thunkAPI) => {
    try {
      return await authService.checkStaff(userData.username);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const checkEmail = createAsyncThunk(
  "auth/checkEmail",
  async (email: string, thunkAPI) => {
    try {
      return await authService.checkEmail(email)
    } catch (error: any) {
      const message = (error.response && error.response.data
        && error.response.data.message) ||
        error.message || error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)
export const checkUsername = createAsyncThunk(
  "auth/checkUser",
  async (username: string, thunkAPI) => {
    try {
      return await authService.checkUserName(username)
    } catch (error: any) {
      const message = (error.response && error.response.data
        && error.response.data.message) ||
        error.message || error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)
// Remove keys thunk
export const removeKeys = createAsyncThunk<any, { id: number }, { rejectValue: string }>(
  "auth/removeKeys",
  async (userData, thunkAPI) => {
    try {
      return await authService.removeKeys(userData.id);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.OTPverified = false;
      state.isStaff = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.pending, (state) => { state.isLoading = true; })
      .addCase(register.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userState = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload ?? "Error desconocido";
        state.userState = null;
      })

      // LOGIN
      .addCase(login.pending, (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userState = action.payload;
        state.logoutState = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload ?? "Error desconocido";
        state.userState = null;
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.userState = null;
        state.logoutState = false;
      })

      // ACTIVATE
      .addCase(activate.pending, (state) => { state.isLoading = true; })
      .addCase(activate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Puedes guardar respuesta si tu backend retorna algo útil
      })
      .addCase(activate.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload ?? "Error desconocido";
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => { state.isLoading = true; })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload ?? "Error desconocido";
      })

      // RESET PASSWORD CONFIRM
      .addCase(resetPasswordConfirm.pending, (state) => { state.isLoading = true; })
      .addCase(resetPasswordConfirm.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(resetPasswordConfirm.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload ?? "Error desconocido";
      })

      .addCase(getUserInfo.pending, (state) => { state.isLoading = true; })
      .addCase(getUserInfo.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Error desconocido";
      })

      .addCase(checkEmail.pending, (state) => { state.isLoading = true; })
      .addCase(checkEmail.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(checkEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Error desconocido";
      })

      .addCase(checkUsername.pending, (state) => { state.isLoading = true; })
      .addCase(checkUsername.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(checkUsername.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Error desconocido";
      })

      .addCase(sendOTP.pending, (state) => { state.isLoading = true; })
      .addCase(sendOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload ?? "Error desconocido";
      })

      .addCase(checkOTP.pending, (state) => { state.isLoading = true; })
      .addCase(checkOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.OTPverified = true;
        state.logoutState = true;
      })
      .addCase(checkOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.OTPverified = false;
        state.isError = true;
        state.message = action.payload ?? "Error desconocido";
      })

      .addCase(checkStaff.pending, (state) => { state.isLoading = true; })
      .addCase(checkStaff.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.isLoading = false;
        state.isStaff = action.payload;
      })
      .addCase(checkStaff.rejected, (state, action) => {
        state.isLoading = false;
        state.isStaff = false;
        state.isError = true;
        state.message = action.payload ?? "Error desconocido";
      })

      .addCase(removeKeys.pending, (state) => { state.isLoading = true; })
      .addCase(removeKeys.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(removeKeys.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload ?? "Error desconocido";
      });
  }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
