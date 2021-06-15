import Discord from "discord.js";

import Command from "@/types/CommandConfig";
import CommandInfo from "@/types/CommandInfo";
import CommandMessage from "@/types/CommandMessage";

export default abstract class AbstractCommand implements Command {
    public static readonly scope = 'command'

    public abstract ru: CommandInfo
    public abstract en: CommandInfo
    public boostRequired?: boolean
    public requiredArgs?: number
    public memberPermissions?: Array<Discord.PermissionString>
    public botPermissions?: Array<Discord.PermissionString>

    public abstract execute(cmd: CommandMessage): Promise<any>
}