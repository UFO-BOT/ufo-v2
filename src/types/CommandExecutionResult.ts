import {InteractionReplyOptions, ReplyMessageOptions} from "discord.js";
import CommandExecutionError from "@/types/CommandExecutionError";

export default interface CommandExecutionResult {
    reply?: string | InteractionReplyOptions | ReplyMessageOptions
    error?: CommandExecutionError
    data?: any
}