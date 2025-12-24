import { useEffect, createContext, useState, useContext, useCallback } from "react";
import type { IUser } from "@/types/auth.type"
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface IAuthContext {
    user: IUser | null
    accessToken: string | null
    setAccessToken: (token: string | null) => void
    logout: () => void
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null)
    const [accessToken, setAccessTokenState] = useState<string | null>(null)

    // ✅ Centralized token setter that keeps everything in sync
    const setAccessToken = useCallback((token: string | null) => {
        if (token) {
            try {
                const decoded: IUser = jwtDecode(token)
                setUser(decoded)
                setAccessTokenState(token)
                localStorage.setItem("accessToken", token)
            } catch (error) {
                console.error('Invalid token:', error)
                setUser(null)
                setAccessTokenState(null)
                localStorage.removeItem("accessToken")
            }
        } else {
            setUser(null)
            setAccessTokenState(null)
            localStorage.removeItem("accessToken")
        }
    }, [])

    const logout = useCallback(() => {
        setAccessToken(null)
    }, [setAccessToken])

    // ✅ Initialize from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setAccessToken(token)
        }
    }, [setAccessToken])

    // ✅ Sync across tabs when localStorage changes
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "accessToken") {
                if (e.newValue) {
                    setAccessToken(e.newValue)
                } else {
                    setAccessToken(null)
                }
            }
        }

        window.addEventListener("storage", handleStorageChange)
        return () => window.removeEventListener("storage", handleStorageChange)
    }, [setAccessToken])

    // ✅ Sync when tab becomes visible again
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                const storedToken = localStorage.getItem("accessToken")
                const currentToken = accessToken

                // Re-sync if tokens don't match
                if (storedToken !== currentToken) {
                    console.log('🔄 Tab visible: Syncing token from localStorage')
                    setAccessToken(storedToken)
                }
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
    }, [accessToken, setAccessToken])

    const value = {
        user,
        accessToken,
        setAccessToken,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within AuthProvider")
    return context
}
