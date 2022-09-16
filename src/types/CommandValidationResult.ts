import CommandOption from "@/types/CommandOption";
import ExecutionError from "@/types/ExecutionError";

export default interface CommandValidationResult {
    valid: boolean
    args?: Record<string, any>
    problemOption?: CommandOption
    error?: ExecutionError
}