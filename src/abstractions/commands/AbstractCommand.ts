import Discord from "discord.js";

import ICommand from "@/interfaces/CommandInterface";
import ICommandInfo from "@/interfaces/CommandInfo";
import ICommandMessage from "@/interfaces/CommandMessage";

export default abstract class AbstractCommand implements ICommand {
    public static readonly scope = 'command'

    public abstract ru: ICommandInfo
    public abstract en: ICommandInfo
    public boostRequired?: boolean
    public requiredArgs?: number
    public memberPermissions?: Array<Discord.PermissionString>
    public botPermissions?: Array<Discord.PermissionString>

    public abstract execute(cmd: ICommandMessage): Promise<any>
}