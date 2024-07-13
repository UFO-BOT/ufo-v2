import Embed from "@/types/embed/Embed";

export default interface PunishmentMessage {
    enabled: boolean
    message?: string
    embed?: Embed
}