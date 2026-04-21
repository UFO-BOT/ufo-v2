import SubscriptionType from "@/types/subscriptions/SubscriptionType";
import SubscriptionMonthsCount from "@/types/subscriptions/SubscriptionMonthsCount";
import Language from "@/types/Language";

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
        type: SubscriptionType
        months: SubscriptionMonthsCount
        language: Language
        subscription_id?: string
    }
    refundable: boolean
    test: boolean
}