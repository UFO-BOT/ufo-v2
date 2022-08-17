import CommandOption from "@/types/CommandOption";

export default interface CommandValidationResult {
    valid: boolean
    args?: Record<string, any>
    problemOption?: CommandOption
}