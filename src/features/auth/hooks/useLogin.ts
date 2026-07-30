import { useMutation } from "@tanstack/react-query";
import { loginApi as login,RegisterApi as register } from "../api/authApi";
import type { AxiosError } from "axios";
import { setSession } from "@/services/tokenService";
import { toast } from "react-toastify";



export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (session)=>{
      toast.success("Login Successful");
      setSession(session)
    },
    onError:(err:AxiosError<any>)=>{
      toast.error("Login failed, "+err.response?.data.message)
      console.log(err.response?.data.message)
    }
  });

  return {
    login: mutation.mutateAsync,
    data: mutation.data,
    error: mutation.error,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset,
  };
};
export const useRegister = () => {
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: ()=>{
      toast.success("Registration Successful");
    },
    onError:(err:AxiosError<any>)=>{
      toast.error("Login failed, "+err.response?.data.message)
      console.log(err.response?.data.message)
    }
  });

  return {
    register: mutation.mutateAsync,
    data: mutation.data,
    error: mutation.error,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset,
  };
};