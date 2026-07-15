
import { apiClient } from "@/api/axios";
import type { LoginRequest } from "../types/auth.types";


export const loginApi = async(data:LoginRequest) =>{
    const response = await apiClient.post("/auth/login",data)
    return response.data.data;
}