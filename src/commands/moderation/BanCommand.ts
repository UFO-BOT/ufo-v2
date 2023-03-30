import {ApplicationCommandOptionType, PermissionResolvable, User} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import BanAction from "@/services/moderation/actions/BanAction";

interface BanCommandDTO {
    user: User
    duration?: number
    daysDelete?: number
    reason?: string
}

export default class BanCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "бан",
            description: 'Банит пользователя на сервере по указанной причине',
            aliases: ['забанить', 'банхаммер', 'огонь', 'б']
        },
        en: {
            name: "ban",
            description: 'Bans a user from the server for specified reason',
            aliases: ['ipban', 'banhammer', 'superban', 'fire', 'b']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.User,
            name: "user",
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
        },
        {
            type: ApplicationCommandOptionType.String,
            validationType: CommandOptionValidationType.Duration,
            name: "duration",
            config: {
                ru: {
                    name: "длительность",
                    description: "Длительность бана"
                },
                en: {
                    name: "duration",
                    description: "Ban duration"
                }
            },
            required: false
        },
        {
            type: ApplicationCommandOptionType.Integer,
            name: "daysDelete",
            config: {
                ru: {
                    name: "дни_очистки",
                    description: "Количество дней, за которые очистить сообщения пользователя"
                },
                en: {
                    name: "days_delete",
                    description: "Amount of days to delete user messages"
                }
            },
            minValue: 1,
            maxValue: 7,
            required: false
        },
        {
            type: ApplicationCommandOptionType.String,
            validationType: CommandOptionValidationType.LongString,
            name: "reason",
            config: {
                ru: {
                    name: "причина",
                    description: "Причина бана"
                },
                en: {
                    name: "reason",
                    description: "Ban reason"
                }
            },
            required: false
        }
    ]
    public category = CommandCategory.Moderation;
    public defaultMemberPermissions: PermissionResolvable = ["BanMembers"];
    public botPermissions: PermissionResolvable = ["BanMembers"];
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<BanCommandDTO>): Promise<CommandExecutionResult> {
        let action = new BanAction({
            guild: ctx.guild,
            user: ctx.args.user,
            executor: ctx.member,
            daysDelete: ctx.args.daysDelete,
            duration: ctx.args.duration,
            reason: ctx.args.reason
        })
        let embed = await action.execute();
        return {reply: {embeds: [embed]}}
    }
}