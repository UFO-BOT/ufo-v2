import {ModalBuilder} from "discord.js";
import ExecutionError from "@/types/ExecutionError";

export default interface InteractionExecutionResult {
    action?: 'update' | 'reply'
    ephemeral?: boolean
    error?: ExecutionError
    ended?: boolean
    modal?: ModalBuilder
}