import ModAction from "@/types/ModAction";
import {Guild, GuildMember, GuildTextBasedChannel, User} from "discord.js";

export default interface ModerationActionOptions {
    action: ModAction
    guild: Guild
    user: User
    member?: GuildMember
    executor: GuildMember
    reason: string
    duration?: number
    autoMod?: boolean
}