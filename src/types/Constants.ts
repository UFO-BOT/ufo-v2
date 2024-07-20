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

export default interface Constants {
    defaultPrefix: string
    defaultMoneySymbol: string
    colors: Colors
    paths: Paths
    limits: Limits
}