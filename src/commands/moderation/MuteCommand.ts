import {ApplicationCommandOptionType, GuildMember, PermissionResolvable} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import MuteAction from "@/services/moderation/actions/MuteAction";

interface MuteCommandDTO {
    member: GuildMember
    duration?: number
    reason?: string
}

export default class MuteCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "мут",
            description: 'Мутит участника навсегда или на указанное время',
            aliases: [ 'м', 'мьют', 'заткнуть', 'завалить']
        },
        en: {
            name: "mute",
            description: 'Mutes member permanently or for a specified amount of time',
            aliases: ['m', 'shut', 'chatmute']
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
            validationType: CommandOptionValidationType.Duration,
            name: "duration",
            config: {
                ru: {
                    name: "длительность",
                    description: "Длительность мута"
                },
                en: {
                    name: "duration",
                    description: "Mute duration"
                }
            },
            required: false
        },
        {
            type: ApplicationCommandOptionType.String,
            validationType: CommandOptionValidationType.LongString,
            name: "reason",
            config: {
                ru: {
                    name: "причина",
                    description: "Причина мута"
                },
                en: {
                    name: "reason",
                    description: "Mute reason"
                }
            },
            required: false
        }
    ]
    public category = CommandCategory.Moderation;
    public defaultMemberPermissions: PermissionResolvable = ["KickMembers"];
    public botPermissions: PermissionResolvable = ["ManageRoles"];
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<MuteCommandDTO>): Promise<CommandExecutionResult> {
        let action = new MuteAction({
            guild: ctx.guild,
            user: ctx.args.member.user,
            member: ctx.args.member,
            executor: ctx.member,
            duration: ctx.args.duration,
            reason: ctx.args.reason
        })
        let embed = await action.execute();
        return {reply: {embeds: [embed]}}
    }
}