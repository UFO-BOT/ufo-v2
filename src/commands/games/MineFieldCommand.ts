import {ApplicationCommandOptionType} from "discord.js";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/Command";
import CommandOption from "@/types/CommandOption";
import CommandCategory from "@/types/CommandCategory";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import CommandExecutionResult from "@/types/CommandExecutionResult";
import CommandOptionValidationType from "@/types/CommandOptionValidationType";
import GetGuildLeaderboard from "@/utils/GetGuildLeaderboard";
import LeaderboardInteraction from "@/interactions/LeaderboardInteraction";
import Balance from "@/types/database/Balance";
import Settings from "@/types/database/Settings";
import CrashCasinoInteraction from "@/interactions/CrashCasinoInteraction";
import MineFieldInteraction from "@/interactions/MineFieldInteraction";

interface CrashCasinoCommandDTO {
    bet: number
}

export default class MineFieldCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "минное-поле",
            description: 'Запускает игру минное поле на указанное количество денег',
            aliases: ['мп', "мины"]
        },
        en: {
            name: "minefield",
            description: 'Starts minefield game for the specified amount of money',
            aliases: ['mf', 'mines']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.Integer,
            name: "bet",
            config: {
                ru: {
                    name: "ставка",
                    description: "Количество денег для ставки"
                },
                en: {
                    name: "bet",
                    description: "Amount of money to bet"
                }
            },
            required: true,
            minValue: 1
        }
    ]
    public category = CommandCategory.Games;
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<CrashCasinoCommandDTO>): Promise<CommandExecutionResult> {
        let balance = await global.db.manager.findOneBy(Balance, {
            guildid: ctx.guild.id,
            userid: ctx.member.id
        })
        let settings = await global.db.manager.findOneBy(Settings, {guildid: ctx.guild.id})
        let minBet = settings?.minBet ?? 100;
        if(ctx.args.bet < minBet) return {
            error: {
                type: "invalidBet",
                options: {bet: minBet}
            }
        }
        if(balance.balance < ctx.args.bet) return {
            error: {
                type: "notEnoughMoney",
                options: {money: balance.balance}
            }
        }
        balance.balance -= ctx.args.bet;
        await balance.save()
        let interaction = new MineFieldInteraction([ctx.member.id], {
            member: ctx.member,
            balance: balance,
            bet: ctx.args.bet,
            multiplier: 1,
            step: 0,
            field: Array.from({length: 5}, () => Array.from({length: 3}, () =>
                global.client.cache.emojis.hide))
        }, ctx.settings)
        return {interaction: interaction}
    }
}