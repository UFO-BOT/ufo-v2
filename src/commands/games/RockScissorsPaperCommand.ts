import {ApplicationCommandOptionType, GuildMember} from "discord.js";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/Command";
import CommandOption from "@/types/CommandOption";
import CommandCategory from "@/types/CommandCategory";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import CommandExecutionResult from "@/types/CommandExecutionResult";
import CommandOptionValidationType from "@/types/CommandOptionValidationType";
import Balance from "@/types/database/Balance";
import Settings from "@/types/database/Settings";
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
            required: false
        }
    ]
    public category = CommandCategory.Games;
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<RockScissorsPaperDTO>): Promise<CommandExecutionResult> {
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
        let opponentBalance;
        if(ctx.args.member) opponentBalance = await global.db.manager.findOneBy(Balance, {
            guildid: ctx.guild.id,
            userid: ctx.args.member?.id
        })
        let numbers: Array<number> = [];
        for(let i = 0; i < 7; i++) {
            let num;
            do num = Math.round(Math.random()*49 + 1)
            while (numbers.includes(num))
            numbers[i] = num;
        }
        let interaction = new RockScissorsPaperInteraction(ctx.args.member ? [ctx.args.member.id] : [ctx.member.id], {
            member: ctx.member,
            balance: balance,
            bet: ctx.args.bet,
            opponent: ctx.args.member,
            opponentBalance: opponentBalance,
            accepted: false
        }, ctx.settings)
        return {interaction: interaction}
    }
}