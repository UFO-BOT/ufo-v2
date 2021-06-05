import Discord from "discord.js";

import CommandInfo from "@/interfaces/CommandInfo";


export default interface ICommand {
    ru: CommandInfo
    en: CommandInfo
    boostRequired?: boolean
    requiredArgs?: number
    memberPermissions?: Array<Discord.PermissionString>
    botPermissions?: Array<Discord.PermissionString>
}