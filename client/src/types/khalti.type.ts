export interface IKhaltiPaymentSuccess {
    pidx: string
    payment_url: string
    expires_at: string
    expires_in: number
}

export interface IKhaltiPaymentError {
    error_key: string
    return_url?: string[]
    website_url?: string[]
    amount?: string[]
    purchase_order_id?: string[]
    purchase_order_name?: string[]
}

export interface IKhaltiPaymentResponse {
    data?: IKhaltiPaymentSuccess
    error?: IKhaltiPaymentError
}


