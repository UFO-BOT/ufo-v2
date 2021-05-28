import IGuildLanguage from "@/interfaces/GuildLanguage";

export default interface ISettings {
    guildid: string
    prefix: string
    language: IGuildLanguage
    salary: {
        low: number
        high: number
    }
    workcooldown: number
    moneybags: {
        low: number
        high: number
    }
    commission: number
    duelCommission: boolean
    casenum: number
    muterole: number
    boost: boolean
    boostBy: string
}