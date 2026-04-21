import Language from "@/types/Language";
import SubscriptionMonths from "@/types/subscriptions/SubscriptionMonths";

export default interface SubscriptionConfig {
    name: Record<Language, string>
    boosts: number
    role: string
    months: Array<SubscriptionMonths>
    comment: Record<Language, string>
}