export interface IUser {
  id?: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined?: string;
  access?: string;
  refresh?: string;
}

export interface IRegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IOTP {
  email: string;
  otp: string;
  password: string;
}
export interface IOTPRequest {
  email: string;
}

export interface IOTPCheck {
  email: string;
  otp: string;
}

export interface AuthState {
  userState: IUser | null;
  userInfo: IUser | {};
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  OTPverified: boolean;
  logoutState: boolean;
  isStaff: boolean;
}
