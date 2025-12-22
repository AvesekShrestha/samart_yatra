interface IPaymentProduct {
    identity: string
    name: string
    total_price: number
    quantity: number
    unit_price: number
}

export interface IPaymentResponse {
    pidx?: string
    payment_url?: string
    expires_at?: string
    expires_in?: number
    error?: IPaymentError
}

export interface IPaymentRequest {
    return_url: string
    website_url: string
    amount: number
    purchase_order_id: string
    purchase_order_name: string
    product_details?: IPaymentProduct[]
}

interface IPaymentError {
    return_url?: string[]
    website_url?: string[]
    amount?: string[]
    purchase_order_id?: string[]
    purchase_order_name?: string[]
    error_key: string

}


