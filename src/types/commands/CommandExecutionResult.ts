import {EmojiIdentifierResolvable, InteractionReplyOptions, BaseMessageOptions} from "discord.js";
import ExecutionError from "@/types/ExecutionError";
import AbstractInteraction from "@/abstractions/AbstractInteraction";

export default interface CommandExecutionResult {
    reply?: string | InteractionReplyOptions | BaseMessageOptions
    error?: ExecutionError
    data?: any
    interaction?: AbstractInteraction
}