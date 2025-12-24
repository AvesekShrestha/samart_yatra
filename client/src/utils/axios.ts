import { jwtDecode } from "jwt-decode"
import type { IJwtDecodePayload } from "@/types/token.type"
import { useAuth } from "@/context/authContext"
import { useMemo, useRef } from "react"
import axios from "axios"

export const useAxios = () => {
    const { accessToken, setAccessToken } = useAuth()
    const refreshPromiseRef = useRef<Promise<string> | null>(null)

    const isTokenExpired = (token: string) => {
        if (!token) return true
        try {
            const payload: IJwtDecodePayload = jwtDecode(token)
            const exp = payload.exp * 1000
            // Refresh 30 seconds before expiry
            return Date.now() >= (exp - 30000)
        } catch (error) {
            console.error('Token decode error:', error)
            return true
        }
    }

    const refreshToken = async (): Promise<string> => {
        if (refreshPromiseRef.current) {
            return refreshPromiseRef.current
        }

        refreshPromiseRef.current = (async () => {
            try {
                console.log('🔄 Refreshing token...')
                const res = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                )

                const newToken = res.data.data.accessToken
                console.log('✅ Token refreshed successfully')

                // ✅ This now updates both state AND localStorage
                setAccessToken(newToken)

                return newToken
            } catch (error) {
                console.error('❌ Token refresh failed:', error)
                setAccessToken(null)
                throw error
            } finally {
                refreshPromiseRef.current = null
            }
        })()

        return refreshPromiseRef.current
    }

    // ✅ useMemo ensures axios instance is stable unless baseURL changes
    const axiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: import.meta.env.VITE_BASE_URL,
            withCredentials: true,
        })

        // ✅ Request interceptor - uses fresh accessToken from closure
        instance.interceptors.request.use(
            async (config) => {
                // ✅ Always get fresh token from localStorage as fallback
                let token = accessToken || localStorage.getItem("accessToken")

                if (token) {
                    if (isTokenExpired(token)) {
                        console.log('🟡 Token expired/expiring, refreshing...')
                        token = await refreshToken()
                    }
                    config.headers.Authorization = `Bearer ${token}`
                }

                return config
            },
            (error) => Promise.reject(error)
        )

        // ✅ Response interceptor for 401 errors
        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config

                if (error.response?.status === 401 && !originalRequest._retry) {
                    console.log('🔴 401 error, attempting token refresh...')
                    originalRequest._retry = true

                    try {
                        const newToken = await refreshToken()
                        originalRequest.headers.Authorization = `Bearer ${newToken}`
                        return instance(originalRequest)
                    } catch (refreshError) {
                        console.error('❌ Refresh retry failed, logging out')
                        setAccessToken(null)
                        // Optional: redirect to login
                        // window.location.href = '/login'
                        return Promise.reject(refreshError)
                    }
                }

                return Promise.reject(error)
            }
        )

        return instance
    }, []) // ✅ Empty deps - instance is stable

    return axiosInstance
}
