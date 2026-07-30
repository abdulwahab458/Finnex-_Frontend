
import { apiClient } from "@/api/axios";
import type { AuthSession, LoginRequest, RegisterRequest } from "../types/auth.types";
import { getRefreshToken } from "@/services/tokenService";


export const loginApi = async (data: LoginRequest) => {
    const response = await apiClient.post("/auth/login", data)
    return response.data.data;
}
export const RegisterApi = async (data: RegisterRequest) => {
    const response = await apiClient.post("/auth/register", data)
    return response.data.data;
}


export const refreshTokenApi = async (): Promise<AuthSession> => {
    const refreshToken = getRefreshToken();

    const response = await apiClient.post("/auth/refresh", {
        refreshToken,
    });

    return response.data.data;
};