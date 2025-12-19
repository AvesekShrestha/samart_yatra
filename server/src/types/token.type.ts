export interface IAccessTokenPayload {
    userId: string
    username: string
    email: string
    role: string
}

export interface IRefreshTokenPayload {
    userId: string
}
