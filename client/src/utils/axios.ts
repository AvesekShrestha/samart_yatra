import { jwtDecode } from "jwt-decode";
import type { IJwtDecodePayload } from "@/types/token.type";
import { useAuth } from "@/context/authContext";
import { useMemo, useRef } from "react";
import axios from "axios";

export const useAxios = () => {
    const { accessToken, setAccessToken } = useAuth();
    const refreshPromiseRef = useRef<Promise<string> | null>(null);

    const isTokenExpired = (token: string) => {
        if (!token) return true;
        try {
            const payload: IJwtDecodePayload = jwtDecode(token);
            const exp = payload.exp * 1000;
            return Date.now() >= (exp - 30000);
        } catch {
            return true;
        }
    };

    const refreshToken = async (): Promise<string> => {
        if (refreshPromiseRef.current) return refreshPromiseRef.current;

        refreshPromiseRef.current = (async () => {
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newToken = res.data.data.accessToken;

                // Update context and storage
                setAccessToken(newToken);
                localStorage.setItem("accessToken", newToken);

                return newToken;
            } catch (error) {
                setAccessToken(null);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
                throw error;
            } finally {
                refreshPromiseRef.current = null;
            }
        })();

        return refreshPromiseRef.current;
    };

    const axiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: import.meta.env.VITE_BASE_URL,
            withCredentials: true,
        });

        instance.interceptors.request.use(
            async (config) => {
                let token = accessToken || localStorage.getItem("accessToken");

                if (token) {
                    if (isTokenExpired(token)) {
                        try {
                            token = await refreshToken();
                        } catch (err) {
                            return Promise.reject(err);
                        }
                    }
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const newToken = await refreshToken();
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return instance(originalRequest);
                    } catch (refreshError) {
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }, [accessToken]);

    return axiosInstance;
};
