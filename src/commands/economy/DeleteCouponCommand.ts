import {ApplicationCommandOptionType, EmbedBuilder, PermissionResolvable} from "discord.js";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Coupon from "@/types/database/Coupon";

interface DeleteCouponCommandDTO {
    name: string
}

export default class DeleteCouponCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "удалить-купон",
            description: 'Удаляет купон с указанным именем',
            aliases: ['удк']
        },
        en: {
            name: "delete-coupon",
            description: 'Deletes coupon with specified name',
            aliases: ['remove-coupon', 'dcp']
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
    public defaultMemberPermissions: PermissionResolvable = ["ManageGuild"];

    public async execute(ctx: CommandExecutionContext<DeleteCouponCommandDTO>): Promise<CommandExecutionResult> {
        let coupon = await this.db.manager.findOneBy(Coupon, {
            guildid: ctx.guild.id,
            name: ctx.args.name
        })
        if (!coupon) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.couponNotFound}
            }
        }
        await coupon.remove();
        ctx.response.parse({name: coupon.name});
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .setDescription(ctx.response.data.embed.description)
        return {reply: {embeds: [embed]}}
    }
}