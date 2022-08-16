import Discord from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import GuildSettingsCache from "@/types/GuildSettingsCache";

export default interface ClientCacheConfig {
    commands: Discord.Collection<string, AbstractCommand>
    emojis: Record<string, string>
    settings: Discord.Collection<string, GuildSettingsCache>
}