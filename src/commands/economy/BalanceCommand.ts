import {ApplicationCommandOptionType, EmbedBuilder, Role, User} from "discord.js";
import moment from "moment/moment";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import internal from "stream";
import Balance from "@/types/database/Balance";

interface BalanceCommandDTO {
    user?: User
}

export default class BalanceCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "баланс",
            description: 'Отправляет количество денег и опыта указанного участника или участника, вызвавшего эту команду',
            aliases: ['деньги', 'бал']
        },
        en: {
            name: "balance",
            description: 'Sends the amount of money and experience of specified member or member who used this command',
            aliases: ['money', 'bal']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.User,
            name: "user",
            config: {
                ru: {
                    name: "пользователь",
                    description: "Пользователь для просмотра баланса"
                },
                en: {
                    name: "user",
                    description: "User to get their balance"
                }
            },
            required: false
        }
    ]
    public category = CommandCategory.Economy;

    public async execute(ctx: CommandExecutionContext<BalanceCommandDTO>): Promise<CommandExecutionResult> {
        let user = ctx.args.user;
        if(!user) user = ctx.member.user;
        let balance = await global.db.manager.findOneBy(Balance, {
            guildid: ctx.guild.id,
            userid: user.id
        })
        let embed = new EmbedBuilder()
            .setColor(global.constants.colors.system)
            .setAuthor({name: user.tag, iconURL: user.displayAvatarURL()})
            .addFields([{
                name: ctx.response.data.embed.balance,
                value: (balance?.balance?.toLocaleString(ctx.settings.language.interface) ?? "0") + ctx.settings.moneysymb,
                inline: true
            }, {
                name: ctx.response.data.embed.xp,
                value: (balance?.xp?.toLocaleString(ctx.settings.language.interface) ?? "0") + global.client.cache.emojis.xp,
                inline: true
            }])
        let top = await global.db.manager.findBy(Balance, {guildid: ctx.guild.id})
        top.sort((a, b) => b.balance - a.balance)
        let topMember = top.find(m => m.userid === user.id)
        let place = top.indexOf(topMember) + 1;
        ctx.response.parse({
            place: place.toString()
        })
        embed.setDescription(ctx.response.data.embed.description)
        return {reply: {embeds: [embed]}}
    }
}