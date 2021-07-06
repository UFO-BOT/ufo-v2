import GuildLanguage from "@/types/GuildLanguage";
import CommandSettings from "@/types/CommandSettings";
import GuildColor from "@/types/GuildColor";

export default interface GuildSettingsCache {
    prefix: string
    language: GuildLanguage
    color: GuildColor
    boost: boolean
    moneysymb: string
    commandsSettings: Record<string, CommandSettings>
}