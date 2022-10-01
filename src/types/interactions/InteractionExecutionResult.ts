import {ModalBuilder} from "discord.js";
import ExecutionError from "@/types/ExecutionError";
import AbstractInteraction from "@/abstractions/AbstractInteraction";

export default interface InteractionExecutionResult {
    action?: 'update' | 'reply'
    ephemeral?: boolean
    error?: ExecutionError
    ended?: boolean
    interaction?: AbstractInteraction
    modal?: ModalBuilder
}