import ModAction from "@/types/moderation/ModAction";

export default interface AutoModMessage {
    enabled: boolean
    channel?: string | null
    template?: string
}