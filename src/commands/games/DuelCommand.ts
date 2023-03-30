import {ApplicationCommandOptionType, GuildMember} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import Balance from "@/types/database/Balance";
import DuelInteraction from "@/interactions/DuelInteraction";

interface DuelCommandDTO {
    member: GuildMember
    bet: number
}

export default class DuelCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "дуэль",
            description: 'Запускает игру дуэль на указанное количество денег с указанным игроком',
            aliases: ['поединок']
        },
        en: {
            name: "duel",
            description: 'Starts duel game for the specified amount of money with specified player',
            aliases: ['fight']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.User,
            validationType: CommandOptionValidationType.GuildMember,
            name: "member",
            config: {
                ru: {
                    name: "участник",
                    description: "Участник, с которым вы хотите играть"
                },
                en: {
                    name: "member",
                    description: "Member you want to play with"
                }
            },
            noSelf: true,
            required: true
        },
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

    public async execute(ctx: CommandExecutionContext<DuelCommandDTO>): Promise<CommandExecutionResult> {
        ctx.balance.balance -= ctx.args.bet;
        await ctx.balance.save()
        let opponentBalance = await this.db.manager.findOneBy(Balance, {
            guildid: ctx.guild.id,
            userid: ctx.args.member.id
        })
        let interaction = new DuelInteraction([ctx.args.member.id], {
            bet: ctx.args.bet,
            players: [
                {
                    member: ctx.member,
                    balance: ctx.balance,
                    hp: 100,
                    equipment: new Set()
                },
                {
                    member: ctx.args.member,
                    balance: opponentBalance,
                    hp: 100,
                    equipment: new Set()
                }
            ]
        }, ctx.settings)
        return {interaction: interaction}
    }
}