import {ApplicationCommandOptionType, EmbedBuilder, User} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Balance from "@/types/database/Balance";
import GuildSettings from "@/utils/GuildSettings";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";

interface GiveMoneyCommandDTO {
    member: User
    amount: number
}

export default class GiveMoneyCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "дать-деньги",
            description: 'Вы дадите участнику указанное количество ваших денег с учетом комиссии',
            aliases: ['датьденьги', 'заплатить']
        },
        en: {
            name: "give-money",
            description: 'You will give member the specified amount of your money including commission',
            aliases: ['givemoney', 'pay']
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
                    description: "Участник для передачи денег"
                },
                en: {
                    name: "member",
                    description: "Member to give money"
                }
            },
            required: true
        },
        {
            type: ApplicationCommandOptionType.Integer,
            name: "amount",
            config: {
                ru: {
                    name: "количество",
                    description: "Количество денег"
                },
                en: {
                    name: "amount",
                    description: "Amount of money"
                }
            },
            required: true,
            minValue: 1
        }
    ]
    public category = CommandCategory.Economy;
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<GiveMoneyCommandDTO>): Promise<CommandExecutionResult> {
        let user = ctx.args.member;
        let amount = ctx.args.amount;
        if (user.id === ctx.member.id) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.giveToYourself}
            }
        }
        let settings = await GuildSettings.findOrCreate(ctx.guild.id);
        let balance1 = await this.db.manager.findOneBy(Balance, {
            guildid: ctx.guild.id,
            userid: ctx.member.id
        })
        if (!balance1?.balance || balance1?.balance < amount) return {
            error: {
                type: "notEnoughMoney",
                options: {money: balance1?.balance ?? 0}
            }
        }
        let balance2 = await this.db.manager.findOneBy(Balance, {
            guildid: ctx.guild.id,
            userid: user.id
        })
        if (!balance2) {
            balance2 = new Balance()
            balance2.guildid = ctx.guild.id;
            balance2.userid = user.id;
            balance2.balance = 0;
            balance2.xp = 0;
            await this.db.manager.save(balance2)
        }
        balance1.balance -= amount;
        let commission = settings?.commission ?? 0;
        let addedAmount = Math.round(amount * (1 - commission / 100));
        balance2.balance += addedAmount;
        await balance1.save();
        await balance2.save();
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .setDescription(`${ctx.member.toString()}: -${amount
                    .toLocaleString(ctx.settings.language.interface)}${ctx.settings.moneysymb}\n` +
                (commission > 0 ? `${ctx.response.data.embed.commission}: ${commission}%\n` : '') +
            `${user.toString()}: +${addedAmount
                .toLocaleString(ctx.settings.language.interface)}${settings.moneysymb}`)
        return {reply: {embeds: [embed]}}
    }
}