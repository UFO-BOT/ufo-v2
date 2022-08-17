import {CommandInteractionOption, Guild, GuildMember, GuildTextBasedChannel, TextChannel} from "discord.js";
import PropertyParser from "@/services/PropertyParser";
import GuildSettingsCache from "@/types/GuildSettingsCache";

export default interface CommandExecutionContext<T = Record<string, any>> {
    guild: Guild
    member: GuildMember
    channel: GuildTextBasedChannel
    args: T
    response: PropertyParser
    settings: GuildSettingsCache
    data?: any
}