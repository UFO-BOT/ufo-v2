import {ApplicationCommandOptionType, GuildMember, PermissionResolvable} from "discord.js";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import KickAction from "@/services/moderation/actions/KickAction";

interface KickCommandDTO {
    member: GuildMember
    reason?: string
}

export default class KickCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "кик",
            description: 'Выгоняет участника с сервера по указанной причине',
            aliases: ['выгнать', 'к']
        },
        en: {
            name: "kick",
            description: 'Kicks a member from the server for specified reason',
            aliases: ['k']
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
        },
        {
            type: ApplicationCommandOptionType.String,
            validationType: CommandOptionValidationType.LongString,
            name: "reason",
            config: {
                ru: {
                    name: "причина",
                    description: "Причина кика"
                },
                en: {
                    name: "reason",
                    description: "Kick reason"
                }
            },
            required: false
        }
    ]
    public category = CommandCategory.Moderation;
    public defaultMemberPermissions: PermissionResolvable = ["KickMembers"];
    public botPermissions: PermissionResolvable = ["KickMembers"];
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<KickCommandDTO>): Promise<CommandExecutionResult> {
        let action = new KickAction({
            guild: ctx.guild,
            user: ctx.args.member.user,
            member: ctx.args.member,
            executor: ctx.member,
            reason: ctx.args.reason
        })
        let embed = await action.execute();
        return {reply: {embeds: [embed]}}
    }
}