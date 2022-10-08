import ModAction from "@/types/ModAction";
import {Guild, GuildMember, GuildTextBasedChannel, User} from "discord.js";

export default interface ModerationActionOptions {
    action: ModAction
    guild: Guild
    user: User
    member?: GuildMember
    executor: GuildMember
    daysDelete?: number
    reason?: string
    duration?: number
    number?: number
    autoMod?: boolean
}