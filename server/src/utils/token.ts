import { InvalidPayloadError } from "../types/error.type";
import { jwt_secret } from "../config/constants";
import { IRefreshTokenPayload, IAccessTokenPayload } from "../types/token.type";
import jwt from "jsonwebtoken"

export const generateAccessToken = (payload: IAccessTokenPayload) => {
    return jwt.sign(payload, jwt_secret, { expiresIn: "15m" })
}

export const generateRefreshToken = (payload: IRefreshTokenPayload) => {
    return jwt.sign(payload, jwt_secret, { expiresIn: "30d" })
}

export const verifyToken = (token: string) => {

    try {
        const decoded = jwt.verify(token, jwt_secret)
        return decoded
    }
    catch (error: any) {
        throw new InvalidPayloadError(error.message)
    }
}
