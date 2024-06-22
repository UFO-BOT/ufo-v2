import {ApplicationCommandOptionType, GuildMember} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import Balance from "@/types/database/Balance";
import RockScissorsPaperInteraction from "@/interactions/RockScissorsPaperInteraction";

interface RockScissorsPaperDTO {
    bet: number
    member?: GuildMember
}

export default class RockScissorsPaperCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "камень-ножницы-бумага",
            description: 'Запускает игру КНБ на указанное количество денег с ботом или указанным участником',
            aliases: ['кнб']
        },
        en: {
            name: "rock-scissors-paper",
            description: 'Starts RSP game for the specified amount of money with the bot or specified member',
            aliases: ['rsp']
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
        },
        {
            type: ApplicationCommandOptionType.User,
            validationType: CommandOptionValidationType.GuildMember,
            name: "member",
            config: {
                ru: {
                    name: "участник",
                    description: "Участник, с которым вы хотите сыграть"
                },
                en: {
                    name: "member",
                    description: "Member you want to play with"
                }
            },
            noSelf: true,
            required: false
        }
    ]
    public category = CommandCategory.Games;
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<RockScissorsPaperDTO>): Promise<CommandExecutionResult> {
        let opponentBalance;
        if(ctx.args.member) opponentBalance = await this.db.manager.findOneBy(Balance, {
            guildid: ctx.guild.id,
            userid: ctx.args.member?.id
        })
        if(!opponentBalance || opponentBalance?.balance < ctx.args.bet) return {
            error: {
                type: "notEnoughMoney",
                options: {money: opponentBalance?.balance ?? 0, opponent: ctx.args.member}
            }
        }
        ctx.balance.balance -= ctx.args.bet;
        await ctx.balance.save()
        let interaction = new RockScissorsPaperInteraction(ctx.args.member ? [ctx.args.member.id] : [ctx.member.id], {
            member: ctx.member,
            balance: ctx.balance,
            bet: ctx.args.bet,
            opponent: ctx.args.member,
            opponentBalance: opponentBalance,
            accepted: false
        }, ctx.settings)
        return {interaction: interaction}
    }
}