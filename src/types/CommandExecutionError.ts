import MakeError from "@/utils/MakeError";

export default interface CommandExecutionError {
    type: keyof typeof MakeError
    options: Record<string, any>
}