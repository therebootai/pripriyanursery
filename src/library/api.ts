import axios, { AxiosError } from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export interface Customer {
  _id: string;
  name?: string;
  mobile: string;
  createdAt: string;
}

export interface SendOtpResponse {
  success: true;
  message: string;
}

export interface VerifyOtpResponse {
  success: true;
  customer: Customer;
  token?: string; // return JWT later
}

export type ApiErrorResponse = {
  message: string;
};

export const api = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const sendOtp = async (mobile: string): Promise<SendOtpResponse> => {
  try {
    const { data } = await api.post<SendOtpResponse>("/customer/send-otp", {
      mobile,
    });
    console.log(data);
    return data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(err.response?.data?.message ?? "OTP send failed");
  }
};

export const verifyOtp = async (
  mobile: string,
  otp: string
): Promise<VerifyOtpResponse> => {
  try {
    const { data } = await api.post<VerifyOtpResponse>("/customer/verify-otp", {
      mobile,
      otp,
    });
    return data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(err.response?.data?.message ?? "OTP verify failed");
  }
};

export const getCustomer = async (): Promise<Customer> => {
  try {
    const { data } = await api.get<Customer>("/customer/me");
    return data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(err.response?.data?.message ?? "Failed to get customer");
  }
};

export const logout = async () => {
  try {
    await api.post("/customer/logout");
    localStorage.removeItem("customer");
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(err.response?.data?.message ?? "Failed to logout");
  }
};
