interface IErrorDetails {
    filed: string
    message: string
}
export interface IErrorResponse {
    status: number
    details?: IErrorDetails[]
}
