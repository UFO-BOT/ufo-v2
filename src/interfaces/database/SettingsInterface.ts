import IGuildLanguage from "@/interfaces/GuildLanguage";
import ICommandSettings from "@/interfaces/CommandSettings";

export default interface ISettings {
    guildid: string
    prefix: string
    language: IGuildLanguage
    moneysymb: string
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
    commands: Record<string, ICommandSettings>
}