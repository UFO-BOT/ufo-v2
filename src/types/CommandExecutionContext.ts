import {CommandInteractionOption, Guild, GuildMember, GuildTextBasedChannel, TextChannel} from "discord.js";
import PropertyParser from "@/services/PropertyParser";
import GuildSettingsCache from "@/types/GuildSettingsCache";

export default interface CommandExecutionContext {
    guild: Guild
    member: GuildMember
    channel: GuildTextBasedChannel
    args: Record<string, CommandInteractionOption>
    response: PropertyParser
    settings: GuildSettingsCache
    data?: any
}