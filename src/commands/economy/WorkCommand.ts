import {ApplicationCommandOptionType, EmbedBuilder} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Balance from "@/types/database/Balance";
import Settings from "@/types/database/Settings";

export default class WorkCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "работать",
            description: 'Работать и заработать деньги',
            aliases: ['работа', 'заработать']
        },
        en: {
            name: "work",
            description: 'Work and earn money',
            aliases: ['earn']
        }
    }
    public options: Array<CommandOption> = []
    public category = CommandCategory.Economy;

    public async execute(ctx: CommandExecutionContext): Promise<CommandExecutionResult> {
        let settings = await this.db.manager.findOneBy(Settings, {guildid: ctx.guild.id})
        let work = settings?.work ?? {low: 1, high: 500, cooldown: 1200000};
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
            balance.lastwork = 0;
            await this.db.manager.save(balance);
        }
        let timePassed = Date.now() - balance.lastwork;
        if (timePassed < work.cooldown) return {
            error: {
                type: "userCoolDown",
                options: {time: balance.lastwork + work.cooldown}
            }
        }
        let money = Math.floor(Math.random() * (work.high - work.low) + work.low)
        balance.balance += money;
        balance.lastwork = Date.now();
        await balance.save();
        ctx.response.parse({
            salary: money.toLocaleString(ctx.settings.language.interface),
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