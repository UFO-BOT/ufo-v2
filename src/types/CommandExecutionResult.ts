import {InteractionReplyOptions, ReplyMessageOptions} from "discord.js";
import CommandExecutionError from "@/types/CommandExecutionError";
import AbstractInteraction from "@/abstractions/AbstractInteraction";

export default interface CommandExecutionResult {
    reply?: string | InteractionReplyOptions | ReplyMessageOptions
    error?: CommandExecutionError
    data?: any
    interaction?: AbstractInteraction
}