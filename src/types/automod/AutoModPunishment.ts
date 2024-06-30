import ModAction from "@/types/ModAction";

export default interface AutoModPunishment {
    type: ModAction.Warn | ModAction.Mute | ModAction.Kick | ModAction.Ban
    duration?: number
    reason?: string
}