import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useState } from "react"
import type { IResponse } from "@/types/response.type"
import type { IUser } from "@/types/auth.type"
import type { IToken } from "@/types/token.type"
import { useAxios } from "@/utils/axios"
import axios from "axios"
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
            toast.success("Login successful")
            localStorage.setItem("accessToken", data.tokens.accessToken)
            navigate("/")
        },
        onError: (error) => {
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
        <>
            <div>
                <label>Email </label>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div>
                <label>Password </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button onClick={handleOnClick} disabled={isPending}>
                {isPending ? "Logging in..." : "Login"}
            </button>
        </>
    )
}

export default Login
