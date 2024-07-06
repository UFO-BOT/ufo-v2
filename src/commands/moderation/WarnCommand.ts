import {ApplicationCommandOptionType, GuildMember, Message, PermissionResolvable, TextChannel} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import WarnAction from "@/services/moderation/actions/WarnAction";
import Settings from "@/types/database/Settings";
import Case from "@/types/database/Case";
import ModAction from "@/types/moderation/ModAction";
import properties from "@/properties/moderation.json";
import ModerationAction from "@/services/moderation/ModerationAction";
import MuteAction from "@/services/moderation/actions/MuteAction";
import KickAction from "@/services/moderation/actions/KickAction";
import BanAction from "@/services/moderation/actions/BanAction";
import ModerationActionOptions from "@/types/moderation/ModerationActionOptions";
import WarnsPunishmentsExecution from "@/services/moderation/WarnsPunishmentsExecution";

interface WarnCommandDTO {
    member: GuildMember
    reason?: string
}

interface WarnCommandData {
    member: GuildMember
}

export default class WarnCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "пред",
            description: 'Выдает предупреждение указанному участнику по указанной причине',
            aliases: ['предупредить', 'предупреждение', 'варн']
        },
        en: {
            name: "warn",
            description: 'Warns specified member for specified reason',
            aliases: ['w', 'warning']
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
                    description: "Причина предупреждения"
                },
                en: {
                    name: "reason",
                    description: "Warn reason"
                }
            },
            required: false
        }
    ]
    public category = CommandCategory.Moderation;
    public defaultMemberPermissions: PermissionResolvable = ["KickMembers"];
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<WarnCommandDTO>): Promise<CommandExecutionResult> {
        let action = new WarnAction({
            guild: ctx.guild,
            user: ctx.args.member.user,
            member: ctx.args.member,
            executor: ctx.member,
            reason: ctx.args.reason
        })
        let embed = await action.execute();
        return {reply: {embeds: [embed]}, data: {member: ctx.args.member}}
    }

    public async after(message: Message, data: WarnCommandData) {
        let wpExecution = new WarnsPunishmentsExecution({
            guild: message.guild,
            channel: message.channel as TextChannel,
            member: data.member
        })
        await wpExecution.execute()
    }
}