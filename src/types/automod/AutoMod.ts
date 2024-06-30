import AutoModPunishment from "@/types/automod/AutoModPunishment";
import AutoModWhitelist from "@/types/automod/AutoModWhitelist";

export default interface AutoMod {
    enabled: boolean
    deleteMessages?: boolean
    punishment?: AutoModPunishment
    whitelist?: AutoModWhitelist
    options?: object
}