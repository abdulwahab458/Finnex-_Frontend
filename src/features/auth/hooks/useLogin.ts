import { useMutation } from "@tanstack/react-query";
import { loginApi as login } from "../api/authApi";
import type { AxiosError } from "axios";
import { setSession } from "@/services/tokenService";



export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (session)=>{
      console.log(session)
      setSession(session)
    },
    onError:(err:AxiosError<any>)=>{
      console.log(err.response?.data)
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