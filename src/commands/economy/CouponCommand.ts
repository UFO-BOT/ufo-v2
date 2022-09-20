import {ApplicationCommandOptionType, EmbedBuilder, PermissionResolvable} from "discord.js";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import MakeError from "@/utils/MakeError";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import Coupon from "@/types/database/Coupon";
import Balance from "@/types/database/Balance";

interface CouponCommandDTO {
    name: string
}

export default class CouponCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "купон",
            description: 'Использовать купон с указанным названием',
            aliases: ['забрать-купон']
        },
        en: {
            name: "coupon",
            description: 'Use a coupon with specified name',
            aliases: ['grab-coupon']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.String,
            name: "name",
            config: {
                ru: {
                    name: "название",
                    description: "Название купона"
                },
                en: {
                    name: "name",
                    description: "Coupon name"
                }
            },
            required: true
        }
    ]
    public category = CommandCategory.Economy;

    public async execute(ctx: CommandExecutionContext<CouponCommandDTO>): Promise<CommandExecutionResult> {
        let coupon = await this.db.manager.findOneBy(Coupon, {
            guildid: ctx.guild.id,
            name: ctx.args.name
        })
        if (!coupon || (coupon?.created + coupon?.duration) < Date.now()) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.couponNotFound}
            }
        }
        if(coupon.usedBy.includes(ctx.member.id)) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.alreadyUsed}
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
        coupon.usages--;
        coupon.usedBy.push(ctx.member.id);
        coupon.usages <= 0 ? await coupon.remove() : await coupon.save();
        balance.balance += coupon.amount;
        await balance.save();
        ctx.response.parse({
            amount: coupon.amount.toLocaleString(ctx.settings.language.interface),
            monsymb: ctx.settings.moneysymb
        });
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .setDescription(ctx.response.data.embed.description)
            .addFields([
                {
                    name: ctx.response.data.embed.field1,
                    value: coupon.usages.toLocaleString(ctx.settings.language.interface),
                    inline: true
                }
            ])
            .setFooter({text: ctx.response.data.embed.footer})
            .setTimestamp(coupon.created + coupon.duration)
        return {reply: {embeds: [embed]}}
    }
}