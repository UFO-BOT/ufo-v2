import ModAction from "@/types/moderation/ModAction";

export default interface GuildWarnsPunishment {
    warns: number
    punishment: {
        type: ModAction.Mute | ModAction.Kick | ModAction.Ban
        duration: number
    }
}