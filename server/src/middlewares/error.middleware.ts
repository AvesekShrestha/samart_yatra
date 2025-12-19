import { Request, Response, NextFunction } from "express"
import { CustomError, InvalidPayloadError } from "../types/error.type"
import { ZodError } from "zod"
import { sendError } from "../utils/responseHelper"

export const errorMiddleware = (error: any, _req: Request, res: Response, _next: NextFunction) => {

    if (error instanceof CustomError) {
        sendError(res, error.status, error)
    }
    if (error instanceof ZodError) {
        sendError(res, 400, new InvalidPayloadError(error.message))
    }
}
