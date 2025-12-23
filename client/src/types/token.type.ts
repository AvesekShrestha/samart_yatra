export interface IJwtDecodePayload {
    userId?: string
    username?: string
    email?: string
    role?: string

    iat: number
    exp: number

}

export interface IToken {
    accessToken: string
}
