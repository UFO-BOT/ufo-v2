import {ApplicationCommandOptionType} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
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
            type: ApplicationCommandOptionType.String,
            validationType: CommandOptionValidationType.Bet,
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
            required: true
        }
    ]
    public category = CommandCategory.Games;
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<JackpotCommandDTO>): Promise<CommandExecutionResult> {
        ctx.balance.balance -= ctx.args.bet;
        await ctx.balance.save()
        let numbers: Array<number> = [];
        for(let i = 0; i < 7; i++) {
            let num;
            do num = Math.round(Math.random()*49 + 1)
            while (numbers.includes(num))
            numbers[i] = num;
        }
        let interaction = new JackpotInteraction([ctx.member.id], {
            member: ctx.member,
            balance: ctx.balance,
            bet: ctx.args.bet,
            numbers: numbers
        }, ctx.settings)
        return {interaction: interaction}
    }
}