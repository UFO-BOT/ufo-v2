import {ApplicationCommandOptionType, EmbedBuilder, GuildMember, PermissionResolvable, Role, User} from "discord.js";
import moment from "moment/moment";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import internal from "stream";
import Balance from "@/types/database/Balance";
import MakeError from "@/utils/MakeError";
import {settings} from "cluster";
import GuildSettingsManager from "@/utils/GuildSettingsManager";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import WarnAction from "@/services/moderation/actions/WarnAction";

interface WarnCommandDTO {
    member: GuildMember
    reason?: string
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
            name: "reason",
            config: {
                ru: {
                    name: "причина",
                    description: "Действие с балансом участника"
                },
                en: {
                    name: "reason",
                    description: "Действие с балансом участника"
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
        return {reply: {embeds: [embed]}}
    }
}