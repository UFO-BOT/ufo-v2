interface Colors {
    system: `#${string}`
    error: `#${string}`
}

export default interface Constants {
    defaultPrefix: string
    defaultMoneySymbol: string
    colors: Colors
}