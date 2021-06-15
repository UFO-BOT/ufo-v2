import Discord from "discord.js";

import CommandInfo from "@/types/CommandInfo";


export default interface CommandConfig {
    ru: CommandInfo
    en: CommandInfo
    boostRequired?: boolean
    requiredArgs?: number
    memberPermissions?: Array<Discord.PermissionString>
    botPermissions?: Array<Discord.PermissionString>
}