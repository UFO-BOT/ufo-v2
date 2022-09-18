import {ApplicationCommandOptionType, EmbedBuilder} from "discord.js";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import MakeError from "@/utils/MakeError";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import Coupon from "@/types/database/Coupon";

interface CreateCouponCommandDTO {
    name: string
    amount: number
    usages: number
    duration: number
}

export default class CreateCouponCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "создать-купон",
            description: 'Создает денежный купон на сервере',
            aliases: ['создатькупон', 'ск']
        },
        en: {
            name: "create-coupon",
            description: 'Creates a money coupon on the server',
            aliases: ['createcoupon', 'cc']
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
        },
        {
            type: ApplicationCommandOptionType.Integer,
            name: "amount",
            config: {
                ru: {
                    name: "сумма",
                    description: "Сумма денег купона"
                },
                en: {
                    name: "amount",
                    description: "Coupon money amount"
                }
            },
            required: true,
            minValue: 0
        },
        {
            type: ApplicationCommandOptionType.Integer,
            name: "usages",
            config: {
                ru: {
                    name: "использования",
                    description: "Сколько раз можно использовать этот купон"
                },
                en: {
                    name: "usages",
                    description: "How much time can this coupon be used"
                }
            },
            required: true,
            minValue: 0
        },
        {
            type: ApplicationCommandOptionType.String,
            validationType: CommandOptionValidationType.Duration,
            name: "duration",
            config: {
                ru: {
                    name: "длительность",
                    description: "Время действия купона"
                },
                en: {
                    name: "duration",
                    description: "How much time this coupon is valid"
                }
            },
            required: true
        }
    ]
    public category = CommandCategory.Economy;

    public async execute(ctx: CommandExecutionContext<CreateCouponCommandDTO>): Promise<CommandExecutionResult> {
        let count = await global.db.manager.countBy(Coupon, {guildid: ctx.guild.id})
        let limit = ctx.settings.boost ? 25 : 10;
        ctx.response.parse({limit: limit.toString()})
        if(count >= limit) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.limit}
            }
        }
        let coupon = await global.db.manager.findOneBy(Coupon, {
            guildid: ctx.guild.id,
            name: ctx.args.name
        })
        if (coupon) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.alreadyExists}
            }
        }
        coupon = new Coupon()
        coupon.guildid = ctx.guild.id;
        coupon.name = ctx.args.name;
        coupon.amount = ctx.args.amount;
        coupon.usages = ctx.args.usages;
        coupon.duration = ctx.args.duration;
        coupon.created = Date.now();
        coupon.usedBy = [];
        await global.db.manager.save(coupon);
        ctx.response.parse({name: coupon.name});
        let embed = new EmbedBuilder()
            .setColor(global.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .setDescription(ctx.response.data.embed.description)
            .addFields([
                {
                    name: ctx.response.data.embed.field1,
                    value: coupon.amount.toLocaleString(ctx.settings.language.interface),
                    inline: true
                },
                {
                    name: ctx.response.data.embed.field2,
                    value: coupon.usages.toLocaleString(ctx.settings.language.interface),
                    inline: true
                }
            ])
            .setFooter({text: ctx.response.data.embed.footer})
            .setTimestamp(coupon.created + coupon.duration)
        return {reply: {embeds: [embed]}}
    }
}