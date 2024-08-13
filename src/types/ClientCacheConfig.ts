import {Collection, Snowflake} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import AbstractDeveloperCommand from "@/abstractions/commands/AbstractDeveloperCommand";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import AbstractInteraction from "@/abstractions/AbstractInteraction";
import AutomodDetectionsCache from "@/types/automod/AutomodDetectionsCache";

export default interface ClientCacheConfig {
    commands: Collection<string, AbstractCommand>
    devCommands: Collection<string, AbstractDeveloperCommand>
    emojis: Record<string, string>
    settings: Collection<string, GuildSettingsCache>
    interactions: Collection<string, AbstractInteraction>
    detections: Collection<Snowflake, Record<Snowflake, AutomodDetectionsCache>>
    gulags: Set<Snowflake>
    executing: {
        moderation: Set<Snowflake>
        giveaways: Set<Snowflake>
        interactions: Set<string>
    }
}