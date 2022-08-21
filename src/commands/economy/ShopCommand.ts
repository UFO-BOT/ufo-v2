import {ApplicationCommandOptionType, EmbedBuilder, Role, User} from "discord.js";
import moment from "moment/moment";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/Command";
import CommandOption from "@/types/CommandOption";
import CommandCategory from "@/types/CommandCategory";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import CommandExecutionResult from "@/types/CommandExecutionResult";
import internal from "stream";
import Balance from "@/types/database/Balance";
import Settings from "@/types/database/Settings";
import MakeError from "@/utils/MakeError";
import Item from "@/types/database/Item";
import {settings} from "cluster";

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
        let items = await global.db.manager.findBy(Item, {guildid: ctx.guild.id})
        let embed = new EmbedBuilder()
            .setColor(global.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.guild.iconURL()})
        if(items.length === 0) embed.setDescription(ctx.response.data.embed.empty)
        items.forEach(item => {
            embed.addFields({
                name: `${item.name} - ${item.price.toLocaleString(ctx.settings.language.interface)}${ctx.settings.moneysymb}`,
                value: item.description?.length ? item.description : ctx.response.data.embed.noDescription
            })
        })
        return {reply: {embeds: [embed]}};
    }
}