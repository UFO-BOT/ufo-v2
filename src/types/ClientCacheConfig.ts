import Discord from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import AbstractDevCommand from "../../deleted/AbstractDevCommand";
import GuildSettingsCache from "@/types/GuildSettingsCache";

export default interface ClientCacheConfig {
    commands: Discord.Collection<string, AbstractCommand>
    devCommands: Discord.Collection<string, AbstractDevCommand>
    emojis: Record<string, string>
    settings: Discord.Collection<string, GuildSettingsCache>
}