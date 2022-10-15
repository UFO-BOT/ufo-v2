import {PermissionResolvable} from "discord.js";
import CommandConfig from "@/types/commands/CommandConfig";
import Language from "@/types/Language";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";

export default interface Command {
    config: Record<Language, CommandConfig>
    options: Array<CommandOption>
    category: CommandCategory
    defaultMemberPermissions?: PermissionResolvable
    botPermissions?: PermissionResolvable
    deferReply?: boolean
    boostRequired?: boolean
}