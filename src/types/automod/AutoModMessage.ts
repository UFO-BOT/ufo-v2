import ModAction from "@/types/ModAction";

export default interface AutoModMessage {
    enabled: boolean
    channel?: string | null
    template?: string
}