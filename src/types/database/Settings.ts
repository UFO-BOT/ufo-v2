import GuildLanguage from "@/types/GuildLanguage";
import GuildColor from "@/types/GuildColor";
import CommandSettings from "@/types/CommandSettings";

export default interface Settings {
    guildid: string
    prefix: string
    language: GuildLanguage
    color: GuildColor
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
    commands: Record<string, CommandSettings>
}