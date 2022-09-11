interface Colors {
    system: `#${string}`
    error: `#${string}`
    warning: `#${string}`
    success: `#${string}`
}

interface Paths {
    commands: string
    eventsClient: string
    eventsManager: string
}

export default interface Constants {
    defaultPrefix: string
    defaultMoneySymbol: string
    colors: Colors
    paths: Paths
}