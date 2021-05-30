import Discord from "discord.js";

import AbstractCommand from "@/abstractions/AbstractCommand";
import IGuildLanguage from "@/interfaces/GuildLanguage";
import ICommandSettings from "@/interfaces/CommandSettings";

export default interface IClientCache {
    commands: Discord.Collection<string, AbstractCommand>
    emojis: Record<string, string>
    prefixes: Discord.Collection<string, string>
    languages: Discord.Collection<string, IGuildLanguage>
    commandsSettings: Discord.Collection<string, Record<string, ICommandSettings>>
    moneysymbs: Discord.Collection<string, string>
}