export interface YookassaPayment {
    id: string
    status: string
    amount: {
        value: string
        currency: string
    }
    confirmation: {
        type: string
        confirmation_url: string
    }
    created_at: string
    description: string
    metadata: {
        user_id: string
    }
    refundable: boolean
    test: boolean
}