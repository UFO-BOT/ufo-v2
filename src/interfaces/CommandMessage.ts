import Discord from "discord.js";

import IGuildLanguage from "@/interfaces/GuildLanguage";

export default interface ICommandMessage {
    message: Discord.Message
    args: Array<string>
    flags?: Record<string, boolean>
    prefix?: string
    language?: IGuildLanguage
    moneysymb?: string
}