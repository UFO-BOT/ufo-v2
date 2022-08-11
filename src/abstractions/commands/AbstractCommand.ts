import {Message, PermissionResolvable} from "discord.js";

import Command from "@/types/Command";
import CommandConfig from "@/types/CommandConfig";
import Language from "@/types/Language";
import CommandOption from "@/types/CommandOption";
import CommandCategory from "@/types/CommandCategory";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import CommandExecutionResult from "@/types/CommandExecutionResult";

export default abstract class AbstractCommand implements Command {
    public static readonly scope = 'command'

    public abstract config: Record<Language, CommandConfig>
    public abstract options: Array<CommandOption>
    public abstract category: CommandCategory
    public defaultMemberPermissions?: PermissionResolvable
    public deferReply?: boolean
    public boostRequired?: boolean

    public abstract execute(ctx: CommandExecutionContext): Promise<CommandExecutionResult>
    public async after?(ctx: CommandExecutionContext, message: Message): Promise<void>
}