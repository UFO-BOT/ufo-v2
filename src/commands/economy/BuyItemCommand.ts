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
import Balance from "@/types/database/Balance";
import {settings} from "cluster";

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
            aliases: ['buyitem', 'buyitem', 'bi']
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
        let item = await global.db.manager.findOneBy(Item, {guildid: ctx.guild.id, name: ctx.args.name})
        if(!item) return {
            reply: {
                embeds: [
                    MakeError.other(ctx.member, ctx.settings, ctx.response.data.errors.itemNotFound)
                ],
                ephemeral: true
            }
        }
        let balance = await global.db.manager.findOneBy(Balance, {
            guildid: ctx.guild.id,
            userid: ctx.member.id
        })
        if((balance?.balance ?? 0) < item.price) return {
            reply: {
                embeds: [
                    MakeError.notEnoughMoney(ctx.member, balance?.balance ?? 0, ctx.settings)
                ],
                ephemeral: true
            }
        }
        if (!balance) {
            balance = new Balance()
            balance.guildid = ctx.guild.id;
            balance.userid = ctx.member.id;
            balance.balance = 0;
            balance.xp = 0;
            await global.db.manager.save(balance)
        }
        let addRole = ctx.guild.roles.cache.get(item.addrole);
        let removeRole = ctx.guild.roles.cache.get(item.removerole);
        ctx.response.parse({
            addrole: addRole?.toString(),
            removerole: removeRole?.toString(),
            item: item.name
        })
        if(addRole) {
            if(ctx.guild.members.me.roles.highest.position <= addRole.position) return {
                reply: {
                    embeds: [
                        MakeError.other(ctx.member, ctx.settings, ctx.response.data.errors.noAddRolePermission)
                    ],
                    ephemeral: true
                }
            }
            await ctx.member.roles.add(addRole);
        }
        if(removeRole) {
            if(ctx.guild.members.me.roles.highest.position <= removeRole.position) return {
                reply: {
                    embeds: [
                        MakeError.other(ctx.member, ctx.settings, ctx.response.data.errors.noRemoveRolePermission)
                    ],
                    ephemeral: true
                }
            }
            await ctx.member.roles.remove(removeRole)
        }
        balance.balance -= (item.price ?? 0);
        balance.xp += (item.xp ?? 0);
        await balance.save()
        let embed = new EmbedBuilder()
            .setColor(global.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .setDescription(ctx.response.data.embed.description)
        return {reply: {embeds: [embed]}};
    }
}