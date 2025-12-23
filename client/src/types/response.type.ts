import type { IErrorResponse } from "./error.type"

export interface IResponse<T> {
    success: boolean
    message: string
    data?: T
    error?: IErrorResponse
}
