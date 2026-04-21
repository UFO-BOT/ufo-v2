import SubscriptionMonthsCount from "@/types/subscriptions/SubscriptionMonthsCount";
import Language from "@/types/Language";

export default interface SubscriptionMonths {
    count: SubscriptionMonthsCount
    price: number
    name: Record<Language, string>
}