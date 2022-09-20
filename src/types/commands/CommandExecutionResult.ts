import {EmojiIdentifierResolvable, InteractionReplyOptions, ReplyMessageOptions} from "discord.js";
import ExecutionError from "@/types/ExecutionError";
import AbstractInteraction from "@/abstractions/AbstractInteraction";

export default interface CommandExecutionResult {
    reply?: string | InteractionReplyOptions | ReplyMessageOptions
    error?: ExecutionError
    data?: any
    interaction?: AbstractInteraction
    reactions?: Array<EmojiIdentifierResolvable>
}