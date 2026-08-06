import axios from "axios";
import type {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import {
  getAccessToken,
  getRefreshToken,
  clearSession,
  setSession,
} from "@/services/tokenService";
import type { AuthSession } from "@/features/auth/types/auth.types";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Main client used by the application.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

/**
 * Separate client used ONLY for refreshing tokens.
 * It has NO interceptors to avoid infinite refresh loops.
 */
const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Refresh the access token using the refresh token.
 */
const refreshToken = async (): Promise<AuthSession> => {
  const token = getRefreshToken();

  if (!token) {
    throw new Error("No refresh token available.");
  }

  const response = await authClient.post("/auth/refresh", {
    refreshToken: token,
  });

  return response.data.data;
};

/**
 * Attach access token to every outgoing request.
 */
apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

/**
 * Automatically refresh expired access tokens.
 */
apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const session = await refreshToken();

        // Save new access & refresh tokens
        setSession(session);

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token is also invalid/expired
        clearSession();

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);