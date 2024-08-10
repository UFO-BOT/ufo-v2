import {ApplicationCommandOptionType, EmbedBuilder} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Item from "@/types/database/Item";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";

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
        let items = await this.db.manager.find(Item, {where: {guildid: ctx.guild.id}})
        let limit = ctx.settings.boost ? this.constants.limits.items.boost : this.constants.limits.items.standard
        let item = items.slice(0, limit).find(i => i.name === ctx.args.name)
        if(!item) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.itemNotFound}
            }
        }
        let lang = ctx.settings.language.interface
        let addRole = ctx.guild.roles.cache.get(item.addRole);
        let removeRole = ctx.guild.roles.cache.get(item.removeRole);
        let minXp = typeof item.xp === 'number' ? item.xp : item.xp.min
        let maxXp = typeof item.xp === 'number' ? item.xp : item.xp.max
        let xp = minXp === maxXp ? `${minXp.toLocaleString(lang)}${this.client.cache.emojis.xp}` :
            `${minXp.toLocaleString(lang)}${this.client.cache.emojis.xp} - `
            + `${maxXp.toLocaleString(lang)}${this.client.cache.emojis.xp}`
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .setTitle(item.name)
            .setDescription(item.description?.length ? item.description : null)
            .setThumbnail(item.iconUrl?.length && ctx.settings.boost ? item.iconUrl : null)
            .addFields([
                {
                    name: ctx.response.data.embed.price,
                    value: `${item.price.toLocaleString(lang)}${ctx.settings.moneysymb}`,
                    inline: true
                },
                {
                    name: ctx.response.data.embed.requiredXp,
                    value: `${(item.requiredXp ?? 0).toLocaleString(lang)}${this.client.cache.emojis.xp}`,
                    inline: true
                },
                {
                    name: ctx.response.data.embed.xp,
                    value: `${xp}`,
                    inline: true
                },
                {
                    name: ctx.response.data.embed.addRole,
                    value: addRole ? addRole.toString() : "-",
                    inline: true
                },
                {
                    name: ctx.response.data.embed.removeRole,
                    value: removeRole ? removeRole.toString() : "-",
                    inline: true
                },
                {
                    name: ctx.response.data.embed.requiredRoles,
                    value: item.requiredRoles?.length ? item.requiredRoles.map(r => `<@&${r}>`).join(" ") : "-"
                }
            ])
        return {reply: {embeds: [embed]}};
    }
}