import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ILoginResponse, IUserResponse, LoginPayload, RegisterPayload } from "../../../types/user.type";
import AuthService from "./auth.service";
import { sendSuccess } from "../../../utils/responseHelper";

const AuthController = {

    register: (asyncHandler(async (req: Request, res: Response) => {
        const payload: RegisterPayload = req.body

        const data: IUserResponse = await AuthService.register(payload)
        sendSuccess(res, data, "Registered Successfully", 201)
    })),
    login: (asyncHandler(async (req: Request, res: Response) => {
        const payload: LoginPayload = req.body

        const { tokens, user }: ILoginResponse = await AuthService.login(payload)


        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
        })
        const response: ILoginResponse = {
            tokens: {
                accessToken: tokens.accessToken
            },
            user
        }
        sendSuccess(res, response, "Loggin successful", 200)
    })),
    refresh: (asyncHandler(async (req: Request, res: Response) => {

        const refreshToken = req.cookies.refreshToken || req.body.refreshToken

        console.log(refreshToken)

        const data = await AuthService.refresh(refreshToken)
        sendSuccess(res, data, "Refreshed successfully", 200)

    }))
}

export default AuthController
