import {ApplicationCommandOptionType} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
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

    public async execute(ctx: CommandExecutionContext<CrashCasinoCommandDTO>): Promise<CommandExecutionResult> {
        ctx.balance.balance -= ctx.args.bet;
        await ctx.balance.save()
        let interaction = new MineFieldInteraction([ctx.member.id], {
            member: ctx.member,
            balance: ctx.balance,
            bet: ctx.args.bet,
            multiplier: 1,
            step: 0,
            field: Array.from({length: 5}, () => Array.from({length: 3}, () =>
                this.client.cache.emojis.hide))
        }, ctx.settings)
        return {interaction: interaction}
    }
}