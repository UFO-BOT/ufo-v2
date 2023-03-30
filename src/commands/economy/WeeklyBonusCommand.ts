import {ApplicationCommandOptionType, EmbedBuilder} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Balance from "@/types/database/Balance";
import Settings from "@/types/database/Settings";

export default class WeeklyBonusCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "еженедельный-бонус",
            description: 'Получить еженедельный бонус на сервере',
            aliases: ['енб']
        },
        en: {
            name: "weekly-bonus",
            description: 'Get weekly bonus on the server',
            aliases: ['weekly', 'wb']
        }
    }
    public options: Array<CommandOption> = []
    public category = CommandCategory.Economy;
    public boostRequired = true;

    public async execute(ctx: CommandExecutionContext): Promise<CommandExecutionResult> {
        let settings = await this.db.manager.findOneBy(Settings, {guildid: ctx.guild.id})
        if(!settings?.moneybonuses?.weekly) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.noWeeklyBonus}
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
        if(Date.now() - (balance.lastWeeklyBonus ?? 0) < 604800000) return {
            error: {
                type: "userCoolDown",
                options: {time: balance.lastWeeklyBonus + 604800000}
            }
        }
        balance.balance += settings.moneybonuses.weekly;
        balance.lastWeeklyBonus = Date.now();
        await balance.save();
        ctx.response.parse({
            amount: settings.moneybonuses.weekly.toLocaleString(ctx.settings.language.interface),
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