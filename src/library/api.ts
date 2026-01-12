import { ProductType } from "@/components/product/ProductSection";
import axios, { AxiosError } from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export interface Customer {
  _id: string;
  customerId: string;
  name: string;
  email: string;
  gender: string;
  mobile: string;
  avatar: {
    public_id: string;
    url: string;
  };
  addresses: Array<{
    _id: string;
    type: string;
    name: string;
    mobile: string;
    area: string;
    city: string;
    state: string;
    pin: string;
    alternateMobile: string;
  }>;
  cart: Array<{
    productId: string | ProductType;
    variantId?: string | ProductType;
    quantity: number;
    priceAtTime: number;
  }>;
  wishlist: ProductType[];
  totalOrders: number;
  totalSpent: number;
  rewards: {
    points: number;
    tier: string;
  };
  giftCards: Array<{
    code: string;
    balance: number;
    expiry: Date;
  }>;
  // recentlyViewed: mongoose.Types.ObjectId[];
  notifications: Array<{
    title: string;
    message: string;
    createdAt: Date;
  }>;

  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  customer: Customer;
  message: string;
  isNewUser: boolean;
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
    // console.log(data);
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
    // console.log("verify otp wala data",data);
    return data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(err.response?.data?.message ?? "OTP verify failed");
  }
};

export const getMe = async (): Promise<Customer> => {
  try {
    const { data } = await api.get<Customer>("/customer/me");
    console.log("me data",data);
    return data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(err.response?.data?.message ?? "Failed to get customer");
  }
};

export const getCustomer = async (): Promise<Customer> => {
  try {
    const { data } = await api.get<Customer>("/customer");
    return data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(err.response?.data?.message ?? "Failed to get customers");
  }
};

export const logout = async () => {
  try {
    await api.post("/customer/logout");    
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    throw new Error(err.response?.data?.message ?? "Failed to logout");
  }
};
