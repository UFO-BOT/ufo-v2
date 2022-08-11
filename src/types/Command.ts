import {PermissionResolvable} from "discord.js";
import CommandConfig from "@/types/CommandConfig";
import Language from "@/types/Language";
import CommandOption from "@/types/CommandOption";
import CommandCategory from "@/types/CommandCategory";

export default interface Command {
    config: Record<Language, CommandConfig>
    options: Array<CommandOption>
    category: CommandCategory
    defaultMemberPermissions?: PermissionResolvable
    deferReply?: boolean
    boostRequired?: boolean
}