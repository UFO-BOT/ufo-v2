import {ApplicationCommandOptionType, GuildMember, PermissionResolvable} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import UnmuteAction from "@/services/moderation/actions/UnmuteAction";

interface UnuteCommandDTO {
    member: GuildMember
}

export default class UnmuteCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "размут",
            description: 'Снимает мут с указанного участника',
            aliases: ['размьют', 'снятьмут']
        },
        en: {
            name: "unmute",
            description: 'Unmutes specified member',
            aliases: ['removemute', 'rmmute']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.User,
            validationType: CommandOptionValidationType.GuildMember,
            name: "member",
            config: {
                ru: {
                    name: "участник",
                    description: "Целевой участник"
                },
                en: {
                    name: "member",
                    description: "Target member"
                }
            },
            required: true
        }
    ]
    public category = CommandCategory.Moderation;
    public defaultMemberPermissions: PermissionResolvable = ["KickMembers"];
    public botPermissions: PermissionResolvable = ["ManageRoles"];
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<UnuteCommandDTO>): Promise<CommandExecutionResult> {
        let action = new UnmuteAction({
            guild: ctx.guild,
            user: ctx.args.member.user,
            member: ctx.args.member,
            executor: ctx.member
        })
        let embed = await action.execute();
        return {reply: {embeds: [embed]}}
    }
}