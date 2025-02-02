import {ApplicationCommandOptionType} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Item from "@/types/database/Item";
import ShopInteraction from "@/interactions/ShopInteraction";
import Balance from "@/types/database/Balance";

export default class ShopCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "магазин",
            description: 'Выводит магазин сервера',
            aliases: ['магаз', 'товары']
        },
        en: {
            name: "shop",
            description: 'Shows server shop',
            aliases: ['store', 'items']
        }
    }
    public options: Array<CommandOption> = []
    public category = CommandCategory.Economy;

    public async execute(ctx: CommandExecutionContext): Promise<CommandExecutionResult> {
        let items = await this.db.mongoManager.find(Item, {where: {guildid: ctx.guild.id}})
        let limit = ctx.settings.boost ? this.constants.limits.items.boost : this.constants.limits.items.standard
        items = items.slice(0, limit)
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
        let interaction = new ShopInteraction([ctx.member.id], {
            member: ctx.member,
            balance,
            items,
            page: 1,
            maxPage: Math.ceil(items.length/10)
        }, ctx.settings)
        return {interaction};
    }
}