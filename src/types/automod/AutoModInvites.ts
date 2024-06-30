import AutoMod from "@/types/automod/AutoMod";

export interface AutoModInvitesOptions {
    whitelistGuilds: Array<string>
}

export interface AutoModInvites extends AutoMod {
    options?: AutoModInvitesOptions
}