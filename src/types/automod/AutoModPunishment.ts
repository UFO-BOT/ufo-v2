import ModAction from "@/types/moderation/ModAction";

export default interface AutoModPunishment {
    enabled: boolean
    type?: ModAction.Warn | ModAction.Mute | ModAction.Kick | ModAction.Ban
    duration?: number
    reason?: string
}