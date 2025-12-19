import { CustomError } from "../types/error.type"
import { ISuccessResponse, IErrorResponse, Metadata } from "../types/response.type"
import { Response } from "express"

export const sendSuccess = <T>(res: Response, data: T, message: string = "Success", status: number = 200, metadata?: Metadata) => {
    const response: ISuccessResponse<T> = {
        success: true,
        status,
        message,
        data,
        error: undefined as never,
        metadata
    }
    return res.status(200).json(response)
}


export const sendError = (res: Response, status: number, error: CustomError) => {
    const response: IErrorResponse = {
        success: false,
        status,
        message: error.message,
        error
    }

    return res.status(status).json(response)
}
