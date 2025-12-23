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
        baseURL: import.meta.env.VITE_BASE_URL,
        withCredentials: true,
    })

    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            async (config) => {
                if (accessToken) {
                    if (isTokenExpired(accessToken)) {
                        const res = await axios.post(
                            "http://localhost:8000/api/v1/auth/refresh",
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

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor)
        }
    }, [accessToken, setAccessToken])

    return axiosInstance
}
