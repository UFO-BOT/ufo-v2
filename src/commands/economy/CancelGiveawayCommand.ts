import {
    ApplicationCommandOptionType,
    EmbedBuilder,
    GuildTextBasedChannel,
    Message,
    PermissionResolvable
} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Giveaway from "@/types/database/Giveaway";

interface CancelGiveawayCommandDTO {
    number: number
}

export default class CancelGiveawayCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "отменить-розыгрыш",
            description: 'Отменяет розыгрыш под указанным номером, победитель не определяется',
            aliases: ['отменитьрозыгрыш', 'остановить-розыгрыш', 'ор']
        },
        en: {
            name: "cancel-giveaway",
            description: 'Cancels giveaway with specified number, the winner is not determined',
            aliases: ['cancelgiveaway', 'stop-giveaway', 'cg']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.Integer,
            name: "number",
            config: {
                ru: {
                    name: "номер",
                    description: "Номер розыгрыша для отмены"
                },
                en: {
                    name: "number",
                    description: "Giveaway number to cancel"
                }
            },
            required: true,
            minValue: 1
        }
    ]
    public defaultMemberPermissions: PermissionResolvable = ["ManageGuild"];
    public category = CommandCategory.Economy;
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<CancelGiveawayCommandDTO>): Promise<CommandExecutionResult> {
        let giveaway = await this.db.manager.findOneBy(Giveaway, {
            guildid: ctx.guild.id,
            number: ctx.args.number
        })
        if(!giveaway) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.giveawayNotFound}
            }
        }
        ctx.response.parse({number: giveaway.number.toString()})
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .setDescription(ctx.response.data.embed.description)
        let channel = ctx.guild.channels.cache.get(giveaway.channel) as GuildTextBasedChannel;
        let message = await channel?.messages?.fetch(giveaway.message)?.catch(() => null) as Message;
        if(message) {
            let giveawayEmbed = new EmbedBuilder()
                .setColor(this.constants.colors.error)
                .setAuthor({name: ctx.response.data.giveawayEmbed.author})
                .setDescription(ctx.response.data.giveawayEmbed.description)
                .addFields([
                    {
                        name: ctx.response.data.giveawayEmbed.prize,
                        value: giveaway.prize.toLocaleString(ctx.settings.language.interface),
                        inline: true
                    },
                    {
                        name: ctx.response.data.giveawayEmbed.createdBy,
                        value: `<@${giveaway.creator}>`,
                        inline: true
                    },
                    {
                        name: ctx.response.data.giveawayEmbed.cancelledBy,
                        value: ctx.member.toString(),
                        inline: true
                    }
                ])
                .setFooter({text: ctx.response.data.giveawayEmbed.cancelled})
                .setTimestamp()
            await message.reactions.removeAll().catch(() => {})
            await message.edit({embeds: [giveawayEmbed]})
        }
        await giveaway.remove();
        return {reply: {embeds: [embed]}}
    }
}