import { email, string, z } from "zod"

export interface IUser {
    username: string
    email: string
    password: string
    role: string
}

export const registerSchema = z.object({
    username: string().trim(),
    email: email().trim(),
    password: string().trim().min(8, "Password length must be greater than 8 character"),
    role: string().trim().optional()
})

export const loginSchema = z.object({
    email: string().trim(),
    password: string().min(8, "Password length must be greater than 8 character")
})


export type RegisterPayload = z.infer<typeof registerSchema>
export type LoginPayload = z.infer<typeof loginSchema>

export interface IUserResponse {
    userId: string
    username: string
    email: string
    role: string
}
interface IToken {
    accessToken: string
    refreshToken?: string
}

export interface ILoginResponse {
    tokens: IToken,
    user: IUserResponse
}



