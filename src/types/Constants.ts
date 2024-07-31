import {Limits} from "@/types/Limits";

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

interface Subscription {
    price: number
    boosts: number
    role: string
}

interface Subscriptions {
    standard: Subscription
    premium: Subscription
}

export default interface Constants {
    supportGuildId: string
    defaultPrefix: string
    defaultMoneySymbol: string
    colors: Colors
    paths: Paths
    limits: Limits
    subscriptions: Subscriptions
}