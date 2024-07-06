import {Guild, GuildMember, TextChannel} from "discord.js";

export default interface WarnsPunishmentsExecutionOptions {
    guild: Guild
    channel: TextChannel
    member: GuildMember
}