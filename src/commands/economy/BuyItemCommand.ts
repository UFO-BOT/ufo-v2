import {ApplicationCommandOptionType, EmbedBuilder} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Item from "@/types/database/Item";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import Balance from "@/types/database/Balance";

interface ItemInfoCommandDTO {
    name: string
}

export default class BuyItemCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "купить-товар",
            description: 'Вы купите указанный товар из магазина по его цене',
            aliases: ['купитьтовар', 'купить', 'кт']
        },
        en: {
            name: "buy-item",
            description: 'You will buy specified item from the shop for its price',
            aliases: ['buyitem', 'buy', 'bi']
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
                    description: "Название товара для покупки"
                },
                en: {
                    name: "name",
                    description: "Item name to buy"
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
        if (!item) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.itemNotFound}
            }
        }
        let balance = await this.db.manager.findOneBy(Balance, {
            guildid: ctx.guild.id as string,
            userid: ctx.member.id as string
        })
        if ((balance?.balance ?? 0) < item.price) return {
            error: {
                type: "notEnoughMoney",
                options: {money: balance?.balance ?? 0}
            }
        }
        let addRole = ctx.guild.roles.cache.get(item.addRole);
        let removeRole = ctx.guild.roles.cache.get(item.removeRole);
        ctx.response.parse({
            requiredRoles: item.requiredRoles?.map(r => `<@&${r}>`).join(" "),
            requiredXp: item.requiredXp?.toLocaleString(ctx.settings.language.interface) +
                this.client.cache.emojis.xp,
            addRole: addRole?.toString(),
            removeRole: removeRole?.toString(),
            item: item.name
        })
        if (item.requiredRoles?.find(r => !ctx.member.roles.cache.get(r))) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.requiredRoles}
            }
        }
        if ((balance?.xp ?? 0) < (item.requiredXp ?? 0)) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.requiredXp}
            }
        }
        if (addRole) {
            if (ctx.guild.members.me.roles.highest.position <= addRole.position) return {
                error: {
                    type: "other",
                    options: {text: ctx.response.data.errors.noAddRolePermission}
                }
            }
            await ctx.member.roles.add(addRole);
        }
        if (removeRole) {
            if (ctx.guild.members.me.roles.highest.position <= removeRole.position) return {
                error: {
                    type: "other",
                    options: {text: ctx.response.data.errors.noRemoveRolePermission}
                }
            }
            await ctx.member.roles.remove(removeRole)
        }
        if (!balance) {
            balance = new Balance()
            balance.guildid = ctx.guild.id as string;
            balance.userid = ctx.member.id as string;
            balance.balance = 0;
            balance.xp = 0;
            await this.db.manager.save(balance)
        }
        let minXp = typeof item.xp === 'number' ? item.xp : item.xp.min
        let maxXp = typeof item.xp === 'number' ? item.xp : item.xp.max
        let xp = Math.floor(minXp + (maxXp-minXp) * Math.random())
        balance.balance -= (item.price ?? 0);
        balance.xp += xp;
        await balance.save()
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .setDescription(ctx.response.data.embed.description)
            .setThumbnail(item.iconUrl?.length && ctx.settings.boost ? item.iconUrl : null)
        return {reply: {embeds: [embed]}};
    }
}