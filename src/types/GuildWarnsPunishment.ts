import ModAction from "@/types/ModAction";

export default interface GuildWarnsPunishment {
    warns: number
    punishment: {
        type: ModAction.Mute | ModAction.Kick | ModAction.Ban
        duration: number
    }
}