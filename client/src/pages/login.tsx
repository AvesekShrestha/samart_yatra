import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useState } from "react"
import type { IResponse } from "@/types/response.type"
import type { IUser } from "@/types/auth.type"
import type { IToken } from "@/types/token.type"
import { useAxios } from "@/utils/axios"
import axios, { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"

interface ILoginPayload {
    email: string
    password: string
}

interface ILoginResponse {
    tokens: IToken
    user: IUser
}

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const api = useAxios()
    const navigate = useNavigate()

    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: ILoginPayload): Promise<ILoginResponse> => {
            const response = await api.post<IResponse<ILoginResponse>>("/auth/login", payload)
            if (!response.data.data) {
                throw new Error(response.data.message)
            }
            return response.data.data

        },
        onSuccess: (data) => {
            console.log(data)
            toast.success("Login successful")
            localStorage.setItem("accessToken", data.tokens.accessToken)
            navigate("/")
        },
        onError: (error: AxiosError<IResponse<null>>) => {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Login failed")
            } else {
                toast.error("Something went wrong")
            }
        },
    })

    const handleOnClick = () => {
        mutate({ email, password })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-blue-500 mb-2">Login</h1>
                    <p className="text-gray-500 text-sm">Making Nepal's Public Transport Smarter</p>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            E-mail
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button 
                        onClick={handleOnClick} 
                        disabled={isPending}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {isPending ? "Logging in..." : "Login"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
