import { AlreadyExistsError, InvalidPayloadError, UnauthorizedError } from "../../../types/error.type";
import { IAccessTokenPayload, IRefreshTokenPayload } from "../../../types/token.type";
import { RegisterPayload, registerSchema, loginSchema, IUser, LoginPayload, ILoginResponse, IUserResponse, IToken } from "../../../types/user.type";
import { hashPassword, verifyPassword } from "../../../utils/password";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../../../utils/token";
import UserService from "../user/user.service";
import AuthRepository from "./auth.repository";

const AuthService = {
    async register(paylaod: RegisterPayload): Promise<IUserResponse> {

        const result = registerSchema.safeParse(paylaod);
        if (!result.success) throw result.error

        const userExists = await UserService.userExists(paylaod.email)
        if (userExists) throw new AlreadyExistsError("User already exists")

        const hashedPassword: string = await hashPassword(paylaod.password)
        const role: string = paylaod.role ? paylaod.role : "passenger"

        const newUser: IUser = {
            username: paylaod.username,
            email: paylaod.email,
            password: hashedPassword,
            role: role
        }

        const user = await AuthRepository.register(newUser)
        const response: IUserResponse = {
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role
        }
        return response
    },
    async login(payload: LoginPayload): Promise<ILoginResponse> {

        const result = loginSchema.safeParse(payload)
        if (!result.success) throw result.error

        const user = await UserService.getByEmail(payload.email)
        const passwordVerified = await verifyPassword(payload.password, user.password)

        if (!passwordVerified) throw new InvalidPayloadError("Password doesnot match")

        const accessTokenPayload: IAccessTokenPayload = {
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role
        }

        const refreshTokenPayload: IRefreshTokenPayload = {
            userId: user._id.toString()
        }

        const accessToken: string = generateAccessToken(accessTokenPayload)
        const refreshToken: string = generateRefreshToken(refreshTokenPayload)

        const response: ILoginResponse = {
            tokens: {
                accessToken: accessToken,
                refreshToken: refreshToken
            },
            user: {
                userId: user._id.toString(),
                username: user.username,
                email: user.email,
                role: user.role
            }
        }
        return response
    },
    async refresh(refreshToken: string): Promise<IToken> {

        if (!refreshToken) throw new UnauthorizedError("Refresh token missing")

        const data: any = verifyToken(refreshToken)

        if (!data.userId) throw new UnauthorizedError("Unauthorize")
        const user = await UserService.getById(data.userId)

        const accessTokenPayload: IAccessTokenPayload = {
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role
        }

        const accessToken = generateAccessToken(accessTokenPayload);

        const response: IToken = {
            accessToken
        }
        return response
    }
}

export default AuthService
