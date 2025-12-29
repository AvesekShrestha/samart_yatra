import type { IUser, ILoginCredentials, IRegisterCredentials } from "@/types/auth.type";
import { useEffect, createContext, useState, useContext, useCallback } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
});

interface IAuthContext {
    user: IUser | null;
    accessToken: string | null;
    loginMutation: any;
    registerMutation: any;
    logout: () => Promise<void>;
    isLoading: boolean;
    setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: async (credentials: ILoginCredentials) => {
            const res = await api.post("/auth/login", credentials);
            return res.data;
        },
        onSuccess: (res) => {
            const { tokens, user } = res.data;
            setAccessToken(tokens.accessToken);
            setUser(user);
            localStorage.setItem("accessToken", tokens.accessToken);
            localStorage.setItem("user", JSON.stringify(user));
            toast.success("Login successful");

            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Login failed");
        }
    });

    const registerMutation = useMutation({
        mutationFn: async (credentials: IRegisterCredentials) => {
            const res = await api.post("/auth/register", credentials);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Registration successful! Please login.");
            navigate("/login");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Registration failed");
        }
    });

    const logout = useCallback(async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setAccessToken(null);
            setUser(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");
        if (token && storedUser) {
            setAccessToken(token);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const sync = (e: StorageEvent) => {
            if (e.key === "accessToken" && !e.newValue) {
                setAccessToken(null);
                setUser(null);
                localStorage.removeItem("user");
                navigate("/login");
            }
        };
        window.addEventListener("storage", sync);
        return () => window.removeEventListener("storage", sync);
    }, [navigate]);

    const value = {
        user,
        accessToken,
        loginMutation,
        registerMutation,
        logout,
        isLoading,
        setAccessToken
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

export default AuthProvider;
