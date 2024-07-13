import GuildLanguage from "@/types/GuildLanguage";
import CommandSettings from "@/types/commands/CommandSettings";
import GuildAutoMod from "@/types/automod/GuildAutoMod";
import GuildMessageXp from "@/types/GuildMessageXp";

export default interface GuildSettingsCache {
    prefix: string
    language: GuildLanguage
    moneysymb: string
    commandsSettings: Record<string, CommandSettings>
    minBet: number
    autoModeration: GuildAutoMod
    boost: boolean
    messageXp: GuildMessageXp
}