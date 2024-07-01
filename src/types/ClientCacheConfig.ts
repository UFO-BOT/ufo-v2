import Discord, {Snowflake} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import AbstractInteraction from "@/abstractions/AbstractInteraction";
import AutomodDetectionsCache from "@/types/automod/AutomodDetectionsCache";

export default interface ClientCacheConfig {
    commands: Discord.Collection<string, AbstractCommand>
    emojis: Record<string, string>
    settings: Discord.Collection<string, GuildSettingsCache>
    interactions: Discord.Collection<string, AbstractInteraction>
    moderation: Discord.Collection<Snowflake, Set<Snowflake>>
    detections: Discord.Collection<Snowflake, Record<Snowflake, AutomodDetectionsCache>>
}