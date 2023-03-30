import {ApplicationCommandOptionType} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Item from "@/types/database/Item";
import ShopInteraction from "@/interactions/ShopInteraction";

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
        let items = await this.db.manager.findBy(Item, {guildid: ctx.guild.id})
        let interaction = new ShopInteraction([ctx.member.id], {
            guild: ctx.guild,
            items,
            page: 1,
            maxPage: Math.ceil(items.length/10)
        }, ctx.settings)
        return {interaction};
    }
}