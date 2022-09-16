import {ApplicationCommandOptionType} from "discord.js";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import CrashCasinoInteraction from "@/interactions/CrashCasinoInteraction";

interface CrashCasinoCommandDTO {
    bet: number
}

export default class CrashCasinoCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "краш-казино",
            description: 'Запускает игру краш казино на указанное количество денег',
            aliases: ['краш']
        },
        en: {
            name: "crash-casino",
            description: 'Starts crash casino game for the specified amount of money',
            aliases: ['crash']
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
        if(ctx.balance.balance < ctx.args.bet) return {
            error: {
                type: "notEnoughMoney",
                options: {money: ctx.balance.balance}
            }
        }
        ctx.balance.balance -= ctx.args.bet;
        await ctx.balance.save()
        let interaction = new CrashCasinoInteraction([ctx.member.id], {
            member: ctx.member,
            balance: ctx.balance,
            bet: ctx.args.bet,
            multiplier: 1
        }, ctx.settings)
        return {interaction: interaction}
    }
}