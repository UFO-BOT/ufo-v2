import Discord from "discord.js";

import AbstractCommand from "@/abstractions/AbstractCommand";
import IGuildLanguage from "@/interfaces/GuildLanguage";

export default interface IClientCache {
    commands: Discord.Collection<string, AbstractCommand>
    emojis: Record<string, string>
    prefixes: Discord.Collection<string, string>
    languages: Discord.Collection<string, IGuildLanguage>
    moneysymbs: Discord.Collection<string, string>
}