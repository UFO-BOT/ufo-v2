import {RawGuildChannelData, RawRoleData} from "discord.js/typings/rawDataTypes";
import { APIGuildMember } from "discord.js"
import Settings from "@/types/database/Settings";
import {GuildInfo} from "@/api/types/GuildInfo";

interface RoleData extends RawRoleData {
    memberManageable: boolean
    botManageable: boolean
}

type ChannelData = RawGuildChannelData & {
    botManageable: boolean
}

export interface GuildData extends GuildInfo {
    member: APIGuildMember
    roles: Array<RoleData>
    channels: Array<ChannelData>
    memberHighestRole: RawRoleData
    botHighestRole: RawRoleData
    settings?: Settings
}