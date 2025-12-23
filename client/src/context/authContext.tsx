import { useEffect, createContext, useState, useContext } from "react";
import type { IUser } from "@/types/auth.type"
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface IAuthContext {
    user: IUser | null
    accessToken: string | null
    setAccessToken: React.Dispatch<React.SetStateAction<string | null>>
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<IUser | null>(null)
    const [accessToken, setAccessToken] = useState<string | null>(null)

    useEffect(() => {

        const token = localStorage.getItem("accessToken");
        if (!token) return
        setAccessToken(token)

        const decoded: IUser = jwtDecode(token)
        setUser(decoded)

    }, [])


    const value = {
        user,
        accessToken,
        setAccessToken
    }

    return (

        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider >
    )
}

export default AuthProvider

export const useAuth = () => {

    const context = useContext(AuthContext)
    if (!context) throw new Error("auth context is not set")
    return context
}
