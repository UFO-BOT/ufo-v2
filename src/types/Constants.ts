import {Limits} from "@/types/Limits";
import SubscriptionType from "@/types/subscriptions/SubscriptionType";
import SubscriptionConfig from "@/types/subscriptions/SubscriptionConfig";

interface Colors {
    system: `#${string}`
    error: `#${string}`
    warning: `#${string}`
    success: `#${string}`
}

interface Paths {
    commands: string
    eventsShard: string
    eventsManager: string
    jobs: string
}

export default interface Constants {
    supportGuildId: string
    defaultPrefix: string
    defaultMoneySymbol: string
    colors: Colors
    paths: Paths
    limits: Limits
    subscriptions: Record<SubscriptionType, SubscriptionConfig>
}