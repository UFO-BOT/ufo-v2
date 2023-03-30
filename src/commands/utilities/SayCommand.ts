import {
    ApplicationCommandOptionType,
    ChannelType,
    EmbedBuilder,
    GuildTextBasedChannel,
    PermissionResolvable
} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";

import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import MakeError from "@/utils/MakeError";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";

interface SayCommandDTO {
    text: string
    channel?: GuildTextBasedChannel
}

export default class SayCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "сказать",
            description: 'Отправить введенное сообщение в текущий канал',
            aliases: ['отправить']
        },
        en: {
            name: "say",
            description: 'Sends entered message in current channel',
            aliases: ['send']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.String,
            validationType: CommandOptionValidationType.LongString,
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
        }
    ]
    public category = CommandCategory.Utilities;
    public defaultMemberPermissions: PermissionResolvable = ["ManageMessages"];

    public async execute(ctx: CommandExecutionContext<SayCommandDTO>): Promise<CommandExecutionResult> {
        let text = ctx.args.text;
        let embed = new EmbedBuilder()
        let reply: CommandExecutionResult
        await ctx.channel.send(text).then(() => {
            embed
                .setColor(this.constants.colors.system)
                .setAuthor({name: ctx.response.data.author, iconURL: ctx.member.displayAvatarURL()})
                .setDescription(ctx.response.data.description)
            reply = {reply: {embeds: [embed]}}
        })
        .catch(() => {
            reply = {
                error: {
                    type: "other",
                    options: {text: ctx.response.data.error}
                }
            }
        })
        return {reply: {embeds: [embed], ephemeral: true}}
    }
}