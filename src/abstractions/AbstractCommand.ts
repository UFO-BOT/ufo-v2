import Discord from "discord.js";

import ICommand from "@/interfaces/CommandInterface";
import ICommandInfo from "@/interfaces/CommandInfo";
import ICommandMessage from "@/interfaces/CommandMessage";

import replies from '@/properties/replies.json'

export default abstract class AbstractCommand implements ICommand {
    public abstract ru: ICommandInfo
    public abstract en: ICommandInfo
    public boostRequired?: boolean
    public requiredArgs?: number
    public memberPermissions?: Discord.PermissionResolvable
    public botPermissions?: Discord.PermissionResolvable

    public abstract execute(cmd: ICommandMessage): Promise<any>
}