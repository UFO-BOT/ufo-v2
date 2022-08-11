import {InteractionReplyOptions, ReplyMessageOptions} from "discord.js";

export default interface CommandExecutionResult {
    reply: string | InteractionReplyOptions | ReplyMessageOptions
    data?: any
}