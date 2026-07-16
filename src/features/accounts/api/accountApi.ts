
import { apiClient } from "@/api/axios";
import type { AccountsResponse } from "../types/accounts.type";


export const getAccounts = async() : Promise<AccountsResponse> =>{
    const response = await apiClient.get("/accounts")
    return response.data.data; 
}