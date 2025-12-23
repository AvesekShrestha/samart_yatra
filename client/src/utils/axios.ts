import { jwtDecode } from "jwt-decode"
import type { IJwtDecodePayload } from "@/types/token.type"
import { useAuth } from "@/context/authContext"
import { useEffect } from "react"
import axios from "axios"

export const useAxios = () => {
    const { accessToken, setAccessToken } = useAuth()

    const isTokenExpired = (token: string) => {
        if (!token) return true

        const payload: IJwtDecodePayload = jwtDecode(token)
        const exp = payload.exp * 1000
        return Date.now() >= exp
    }

    const axiosInstance = axios.create({
        baseURL: import.meta.env.BASE_URL,
        withCredentials: true,
    })

    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            async (config) => {
                if (accessToken) {
                    if (isTokenExpired(accessToken)) {
                        const res = await axios.post(
                            "/auth/refresh",
                            {},
                            { withCredentials: true }
                        )

                        setAccessToken(res.data.accessToken)
                        localStorage.setItem("accessToken", res.data.data.accessToken)
                        config.headers.Authorization = `Bearer ${res.data.data.accessToken}`
                    } else {
                        config.headers.Authorization = `Bearer ${accessToken}`
                    }
                }

                return config
            },
            (error) => Promise.reject(error)
        )

        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config

                if (
                    error.response?.status === 401 &&
                    !originalRequest._retry
                ) {
                    originalRequest._retry = true

                    const res = await axios.post(
                        "/auth/refresh",
                        {},
                        { withCredentials: true }
                    )

                    setAccessToken(res.data.accessToken)
                    originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`

                    return axiosInstance(originalRequest)
                }

                return Promise.reject(error)
            }
        )

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor)
            axiosInstance.interceptors.response.eject(responseInterceptor)
        }
    }, [accessToken, setAccessToken])

    return axiosInstance
}
