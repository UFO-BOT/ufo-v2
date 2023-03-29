import GuildLanguage from "@/types/GuildLanguage";
import CommandSettings from "@/types/commands/CommandSettings";

export default interface GuildSettingsCache {
    prefix: string
    language: GuildLanguage
    slashCommands: boolean
    textCommands: boolean
    moneysymb: string
    commandsSettings: Record<string, CommandSettings>
    minBet: number
    boost: boolean
}