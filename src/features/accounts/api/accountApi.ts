
import { apiClient } from "@/api/axios";
import type { AccountsResponse, CreateAccountPayload, UpdateAccountPayload } from "../types/accounts.type";


export const getAccounts = async() : Promise<AccountsResponse> =>{
    const response = await apiClient.get("/accounts")
    return response.data.data; 
}
export const createAccount = async(data:CreateAccountPayload) : Promise<any> =>{
    const response = await apiClient.post("/accounts/create-account",data)
    return response.data.data; 
}
export const updateAccount = async (id:string,accountName:String) => {
    const response = await apiClient.put(`/accounts/${id}`, {
        accountName,
    });
    return response.data;
};
export const deleteAccount = async (id:string) => {
    const response = await apiClient.delete(`/accounts/${id}`);
    return response.data;
};