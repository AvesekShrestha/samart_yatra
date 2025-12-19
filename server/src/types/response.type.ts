import { CustomError } from "./error.type"

export interface Metadata {
    page?: number
    limit?: number
    total?: number
    totalPage?: number
}

export interface IResponse<T> {
    success: boolean
    status: number
    message: string
    data?: T
    error?: CustomError
    metadata?: Metadata
}

export interface ISuccessResponse<T> extends IResponse<T> {
    success: true
    data: T
    error: never
}

export interface IErrorResponse extends IResponse<never> {
    success: false
    error: CustomError
    data?: never
    metadata?: never
}
