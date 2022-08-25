import {ApplicationCommandOptionType, EmbedBuilder} from "discord.js";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/Command";
import CommandOption from "@/types/CommandOption";
import CommandCategory from "@/types/CommandCategory";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import CommandExecutionResult from "@/types/CommandExecutionResult";
import Item from "@/types/database/Item";
import CommandOptionValidationType from "@/types/CommandOptionValidationType";
import MakeError from "@/utils/MakeError";

interface ItemInfoCommandDTO {
    name: string
}

export default class ItemInfoCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "товар-инфо",
            description: 'Shows information about specified item from the shop',
            aliases: ['товаринфо', 'товар-информация', 'товар']
        },
        en: {
            name: "item-info",
            description: 'Shows server shop',
            aliases: ['iteminfo', 'item-information', 'item']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.String,
            validationType: CommandOptionValidationType.LongString,
            name: "name",
            config: {
                ru: {
                    name: "название",
                    description: "Название товара для просмотра информации"
                },
                en: {
                    name: "name",
                    description: "Item name to view the information"
                }
            },
            required: true
        }
    ]
    public category = CommandCategory.Economy;

    public async execute(ctx: CommandExecutionContext<ItemInfoCommandDTO>): Promise<CommandExecutionResult> {
        let item = await global.db.manager.findOneBy(Item, {guildid: ctx.guild.id, name: ctx.args.name})
        if(!item) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.itemNotFound}
            }
        }
        let addRole = ctx.guild.roles.cache.get(item.addrole);
        let removeRole = ctx.guild.roles.cache.get(item.removerole);
        let embed = new EmbedBuilder()
            .setColor(global.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .setTitle(item.name)
            .setDescription(item.description ?? '')
            .addFields([
                {
                    name: ctx.response.data.embed.price,
                    value: `${item.price.toLocaleString(ctx.settings.language.interface)}${ctx.settings.moneysymb}`,
                    inline: true
                },
                {
                    name: ctx.response.data.embed.xp,
                    value: `${item.xp.toLocaleString(ctx.settings.language.interface)}${global.client.cache.emojis.xp}`,
                    inline: true
                },
                {
                    name: ctx.response.data.embed.addrole,
                    value: addRole ? addRole.toString() : "-",
                    inline: true
                },
                {
                    name: ctx.response.data.embed.removerole,
                    value: removeRole ? removeRole.toString() : "-",
                    inline: true
                }
            ])
        return {reply: {embeds: [embed]}};
    }
}