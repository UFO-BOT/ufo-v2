import Discord from "discord.js";

import IGuildLanguage from "@/interfaces/GuildLanguage";

export default interface ICommandMessage {
    message: Discord.Message
    args: Array<string>
    prefix: string
    language: IGuildLanguage
    moneysymb: string
}