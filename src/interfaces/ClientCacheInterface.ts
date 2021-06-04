import Discord from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import AbstractDevCommand from "@/abstractions/commands/AbstractDevCommand";
import IGuildLanguage from "@/interfaces/GuildLanguage";
import ICommandSettings from "@/interfaces/CommandSettings";

export default interface IClientCache {
    commands: Discord.Collection<string, AbstractCommand>
    devCommands: Discord.Collection<string, AbstractDevCommand>
    emojis: Record<string, string>
    prefixes: Discord.Collection<string, string>
    languages: Discord.Collection<string, IGuildLanguage>
    commandsSettings: Discord.Collection<string, Record<string, ICommandSettings>>
    moneysymbs: Discord.Collection<string, string>
}