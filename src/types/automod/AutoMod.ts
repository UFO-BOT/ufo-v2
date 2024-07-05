import AutoModPunishment from "@/types/automod/AutoModPunishment";
import AutoModWhitelist from "@/types/automod/AutoModWhitelist";
import AutoModMessage from "@/types/automod/AutoModMessage";

export default interface AutoMod {
    enabled: boolean
    deleteMessages?: boolean
    message?: AutoModMessage
    punishment?: AutoModPunishment
    whitelist?: AutoModWhitelist
    options?: object
}