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
import JackpotInteraction from "@/interactions/JackpotInteraction";

interface JackpotCommandDTO {
    bet: number
}

export default class JackpotCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "джекпот",
            description: 'Запускает игру джекпот на указанное количество денег',
            aliases: ['дп']
        },
        en: {
            name: "jackpot",
            description: 'Starts jackpot game for the specified amount of money',
            aliases: ['jp']
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

    public async execute(ctx: CommandExecutionContext<JackpotCommandDTO>): Promise<CommandExecutionResult> {
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
        let numbers: Array<number> = [];
        for(let i = 0; i < 7; i++) {
            let num;
            do num = Math.round(Math.random()*49 + 1)
            while (numbers.includes(num))
            numbers[i] = num;
        }
        let interaction = new JackpotInteraction([ctx.member.id], {
            member: ctx.member,
            balance: balance,
            bet: ctx.args.bet,
            numbers: numbers
        }, ctx.settings)
        return {interaction: interaction}
    }
}