import {ApplicationCommandOptionType, EmbedBuilder} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Balance from "@/types/database/Balance";
import Settings from "@/types/database/Settings";

export default class DailyBonusCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "ежедневный-бонус",
            description: 'Получить ежедневный бонус на сервере',
            aliases: ['едб']
        },
        en: {
            name: "daily-bonus",
            description: 'Get daily bonus on the server',
            aliases: ['daily', 'db']
        }
    }
    public options: Array<CommandOption> = []
    public category = CommandCategory.Economy;
    public boostRequired = true;

    public async execute(ctx: CommandExecutionContext): Promise<CommandExecutionResult> {
        let settings = await this.db.manager.findOneBy(Settings, {guildid: ctx.guild.id})
        if(!settings?.moneyBonuses?.daily) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.noDailyBonus}
            }
        }
        let balance = await this.db.manager.findOneBy(Balance, {
            guildid: ctx.guild.id,
            userid: ctx.member.id
        })
        if (!balance) {
            balance = new Balance()
            balance.guildid = ctx.guild.id;
            balance.userid = ctx.member.id;
            balance.balance = 0;
            balance.xp = 0;
            await this.db.manager.save(balance);
        }
        if(Date.now() - (balance.lastDailyBonus ?? 0) < 86400000) return {
            error: {
                type: "userCoolDown",
                options: {time: balance.lastDailyBonus + 86400000}
            }
        }
        balance.balance += settings.moneyBonuses.daily;
        balance.lastDailyBonus = Date.now();
        await balance.save();
        ctx.response.parse({
            amount: settings.moneyBonuses.daily.toLocaleString(ctx.settings.language.interface),
            balance: balance.balance.toLocaleString(ctx.settings.language.interface),
            monsymb: ctx.settings.moneysymb
        })
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .setDescription(ctx.response.data.embed.description)
        return {reply: {embeds: [embed]}};
    }
}