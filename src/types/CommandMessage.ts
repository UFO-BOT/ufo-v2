import Discord from "discord.js";

import GuildLanguage from "@/types/GuildLanguage";
import GuildColor from "@/types/GuildColor";

export default interface CommandMessage {
    message: Discord.Message
    args: Array<string>
    flags?: Record<string, boolean>
    prefix?: string
    language?: GuildLanguage
    color?: GuildColor
    moneysymb?: string
}