import {ApplicationCommandOptionType} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import LeaderboardInteraction from "@/interactions/LeaderboardInteraction";
import Leaderboard from "@/utils/Leaderboard";

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

        let result = await Leaderboard.getGuildLeaderboard(ctx.guild.id, ctx.args.sort, ctx.args.page);
        let interaction = new LeaderboardInteraction([ctx.member.id], {
            guild: ctx.guild,
            leaders: result.leaders,
            sort: ctx.args.sort ?? "balance",
            page: result.page,
            maxPage: result.pageCount
        }, ctx.settings)
        return {interaction: interaction}
    }
}