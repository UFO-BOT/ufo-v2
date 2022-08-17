import {
    ApplicationCommandOptionType, ChannelType,
    EmbedBuilder,
    GuildTextBasedChannel,
    PermissionResolvable
} from "discord.js";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/Command";

import CommandOption from "@/types/CommandOption";
import CommandCategory from "@/types/CommandCategory";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import CommandExecutionResult from "@/types/CommandExecutionResult";
import MakeError from "@/utils/MakeError";

interface SayCommandDTO {
    text: string
    channel?: GuildTextBasedChannel
}

export default class SayCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "сказать",
            description: 'Отправить введенное сообщение в текущий или указанный канал',
            aliases: ['отправить']
        },
        en: {
            name: "say",
            description: 'Sends entered message in current or specified channel',
            aliases: ['send']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.String,
            name: "text",
            config: {
                ru: {
                    name: "текст",
                    description: "Текст для отправки"
                },
                en: {
                    name: "text",
                    description: "Text to send"
                }
            },
            maxLength: 2000,
            required: true
        },
        {
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText, ChannelType.GuildNews],
            name: "channel",
            config: {
                ru: {
                    name: "канал",
                    description: "Канал, в который отправить сообщение",
                },
                en: {
                    name: "channel",
                    description: "Channel to send message to",
                }
            },
            required: false
        }
    ]
    public category = CommandCategory.Utilities;
    public defaultMemberPermissions: PermissionResolvable = ["ManageMessages"];

    public async execute(ctx: CommandExecutionContext<SayCommandDTO>): Promise<CommandExecutionResult> {
        let text = ctx.args.text;
        let channel = ctx.args.channel;
        if(!channel) channel = ctx.channel;
        let embed = new EmbedBuilder()
        await channel.send(text).then(() => {
            embed
                .setColor(process.env.SYSTEM_COLOR)
                .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
                .setDescription(ctx.response.data.embed.description)
        })
        .catch(() => {
            embed = MakeError.other(ctx.member, ctx.settings, ctx.response.data.embed.error)
        })
        return {reply: {embeds: [embed], ephemeral: true}}
    }
}