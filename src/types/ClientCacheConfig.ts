import Discord from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import AbstractDevCommand from "@/abstractions/commands/AbstractDevCommand";
import GuildLanguage from "@/types/GuildLanguage";
import CommandSettings from "@/types/CommandSettings";

export default interface ClientCacheConfig {
    commands: Discord.Collection<string, AbstractCommand>
    devCommands: Discord.Collection<string, AbstractDevCommand>
    emojis: Record<string, string>
    prefixes: Discord.Collection<string, string>
    languages: Discord.Collection<string, GuildLanguage>
    commandsSettings: Discord.Collection<string, Record<string, CommandSettings>>
    moneysymbs: Discord.Collection<string, string>
}