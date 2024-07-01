import {AutoModInvites} from "@/types/automod/AutoModInvites";
import {AutoModFlood} from "@/types/automod/AutoModFlood";

export default interface GuildAutoMod {
    invites: AutoModInvites
    flood: AutoModFlood
}