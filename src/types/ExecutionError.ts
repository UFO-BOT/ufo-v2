import MakeError from "@/utils/MakeError";

export default interface ExecutionError {
    type: keyof typeof MakeError
    options: Record<string, any>
}