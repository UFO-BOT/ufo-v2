import {ApplicationCommandOptionType, GuildBan, PermissionResolvable} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import UnbanAction from "@/services/moderation/actions/UnbanAction";

interface UnbanCommandDTO {
    ban: GuildBan
}

export default class UnbanCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "разбан",
            description: 'Возвращает из бана указанного пользователя',
            aliases: ['разбанить', 'снятьбан']
        },
        en: {
            name: "unban",
            description: 'Unbans specified user',
            aliases: ['rmban', 'unb']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.String,
            validationType: CommandOptionValidationType.Ban,
            name: "ban",
            config: {
                ru: {
                    name: "пользователь",
                    description: "Целевой пользователь"
                },
                en: {
                    name: "user",
                    description: "Target user"
                }
            },
            required: true
        }
    ]
    public category = CommandCategory.Moderation;
    public defaultMemberPermissions: PermissionResolvable = ["BanMembers"];
    public botPermissions: PermissionResolvable = ["BanMembers"];
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<UnbanCommandDTO>): Promise<CommandExecutionResult> {
        let action = new UnbanAction({
            guild: ctx.guild,
            user: ctx.args.ban.user,
            executor: ctx.member,
        })
        let embed = await action.execute();
        return {reply: {embeds: [embed]}}
    }
}