export default interface IGiveaway {
    guildid: string
    channel: string
    message: string
    creator: string
    number: number
    prize: number
    started: number
    duration: number
}