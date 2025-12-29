export interface IUser {
    userId: number
    username: string
    email: string
    role: string
}

interface IToken {
    accessToken: string
}

export interface ILoginResponse {
    tokens: IToken,
    user: IUser
}

export interface ILoginCredentials {
    email: string
    password: string
}

export interface IRegisterCredentials extends ILoginCredentials {
    username: string
}

export interface IUserResponse extends IUser { }
