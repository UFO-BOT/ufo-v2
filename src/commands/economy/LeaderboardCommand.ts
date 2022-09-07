import {ApplicationCommandOptionType, EmbedBuilder, PermissionResolvable, Role, User} from "discord.js";
import moment from "moment/moment";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/Command";
import CommandOption from "@/types/CommandOption";
import CommandCategory from "@/types/CommandCategory";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import CommandExecutionResult from "@/types/CommandExecutionResult";
import internal from "stream";
import Balance from "@/types/database/Balance";
import MakeError from "@/utils/MakeError";
import {settings} from "cluster";
import GuildSettingsManager from "@/utils/GuildSettingsManager";
import CommandOptionValidationType from "@/types/CommandOptionValidationType";
import GetGuildLeaderboard from "@/utils/GetGuildLeaderboard";
import LeaderboardInteraction from "@/interactions/LeaderboardInteraction";

interface LeaderboardCommandDTO {
    sort: 'balance' | 'xp'
    page: number
}

export default class LeaderboardCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "лидеры",
            description: 'Показывает топ участников по балансу или опыту',
            aliases: ['таблица-лидеров', 'топ']
        },
        en: {
            name: "leaders",
            description: 'Shows members balance or experience in the leaderboard',
            aliases: ['leaderboard', 'top']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.String,
            name: "sort",
            config: {
                ru: {
                    name: "сортировка",
                    description: "Сортировка по балансу или опыту",
                    choices: [
                        {name: "баланс", value: "balance"},
                        {name: "опыт", value: "xp"}
                    ]
                },
                en: {
                    name: "sort",
                    description: "Sort by balance or experience",
                    choices: [
                        {name: "balance", value: "balance"},
                        {name: "xp", value: "xp"}
                    ]
                }
            },
            required: false
        },
        {
            type: ApplicationCommandOptionType.Integer,
            name: "page",
            config: {
                ru: {
                    name: "страница",
                    description: "Страница таблицы лидеров"
                },
                en: {
                    name: "page",
                    description: "Leaderboard page"
                }
            },
            minValue: 1,
            required: false
        }
    ]
    public category = CommandCategory.Economy;
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<LeaderboardCommandDTO>): Promise<CommandExecutionResult> {
        let result = await GetGuildLeaderboard(ctx.guild.id, ctx.args.sort, ctx.args.page);
        let interaction = new LeaderboardInteraction([ctx.member.id], {
            guild: ctx.guild,
            leaders: result.leaders,
            sort: ctx.args.sort ?? "balance",
            page: result.page,
            maxPage: result.maxPage
        }, ctx.settings)
        return {interaction: interaction}
    }
}