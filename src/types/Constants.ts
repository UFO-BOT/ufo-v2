interface Colors {
    system: `#${string}`
    error: `#${string}`
}

interface Paths {
    commands: string
    eventsClient: string
}

export default interface Constants {
    defaultPrefix: string
    defaultMoneySymbol: string
    colors: Colors
    paths: Paths
}