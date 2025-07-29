import api from "../../api/axiosInstance";
import { IUser, IRegisterPayload, ILoginPayload, IOTP } from "./types";

const REGISTER_URL = `api/v1/auth/users/`;
const LOGIN_URL = `api/v1/auth/jwt/create/`;
const ACTIVATE_URL = `api/v1/auth/users/activation/`;
const RESET_PASSWORD_URL = `api/v1/auth/users/reset_password/`;
const RESET_PASSWORD_CONFIRM_URL = `api/v1/auth/users/reset_password_confirm/`;
const GET_USER_INFO = `api/v1/auth/users/me/`;
const CHECK_USERNAME = `api/v1/auth/checkUsernameInfo/`;
const CHECK_EMAIL = `api/v1/auth/checkEmailInfo/`;
const SEND_OTP = `api/v1/auth/sendOTP/`;
const CHECK_OTP = `api/v1/auth/checkOTP/`;
const CHECK_STAFF = `api/v1/auth/isStaff/`;
const REMOVE_KEYS = `api/v1/auth/removeKeys/`;

const register = async (userData: IRegisterPayload): Promise<IUser> => {
  const { data } = await api.post(REGISTER_URL, userData);
  return data;
};

const login = async (userData: ILoginPayload): Promise<any> => {
  const { data } = await api.post(LOGIN_URL, userData);
  if (data) localStorage.setItem("user", JSON.stringify(data));
  return data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const activate = async (userData: IUser): Promise<any> => {
  const { data } = await api.post(ACTIVATE_URL, userData);
  return data;
};

const resetPassword = async (userData: IUser): Promise<any> => {
  const { data } = await api.post(RESET_PASSWORD_URL, userData);
  return data;
};

const resetPasswordConfirm = async (userData: IUser): Promise<any> => {
  const { data } = await api.post(RESET_PASSWORD_CONFIRM_URL, userData);
  return data;
};

const getUserInfo = async (accessToken: string): Promise<IUser> => {
  const { data } = await api.get(GET_USER_INFO, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
};

const checkUserName = async (username: string): Promise<any> => {
  const { data } = await api.get(CHECK_USERNAME, { params: { username } });
  return data;
};

const checkEmail = async (email: string): Promise<any> => {
  const { data } = await api.get(CHECK_EMAIL, { params: { email } });
  return data;
};

const sendOTP = async (email: string): Promise<any> => {
  const { data } = await api.post(SEND_OTP, email);
  return data;
};

const checkOTP = async (otp: IOTP): Promise<any> => {
  const { data } = await api.put(CHECK_OTP, otp);
  return data;
};

const checkStaff = async (username: string): Promise<any> => {
  const { data } = await api.get(CHECK_STAFF, { params: { username } });
  return data;
};

const removeKeys = async (userId: number): Promise<any> => {
  const { data } = await api.delete(REMOVE_KEYS, { params: { user: userId } });
  return data;
};

const authService = {
  register,
  login,
  logout,
  activate,
  resetPassword,
  resetPasswordConfirm,
  getUserInfo,
  checkUserName,
  checkEmail,
  sendOTP,
  checkOTP,
  checkStaff,
  removeKeys,
};

export default authService;
