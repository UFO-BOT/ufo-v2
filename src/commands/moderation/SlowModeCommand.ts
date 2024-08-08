import {ApplicationCommandOptionType, EmbedBuilder, PermissionResolvable} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import TimeParser from "@/utils/TimeParser";

interface SlowModeCommandDTO {
    time: number
}

export default class SlowModeCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "слоумод",
            description: 'Активирует медленный режим теукщем в канале на указанное количество времени',
            aliases: ['мр', 'медленный-режим', 'медленка']
        },
        en: {
            name: "slowmode",
            description: 'Activates a slowmode in current channel for specified amount of time',
            aliases: ['sm']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.String,
            validationType: CommandOptionValidationType.Duration,
            name: "time",
            config: {
                ru: {
                    name: "время",
                    description: "Время между сообщениями"
                },
                en: {
                    name: "time",
                    description: "Time between messages"
                }
            },
            required: true
        }
    ]
    public category = CommandCategory.Moderation;
    public defaultMemberPermissions: PermissionResolvable = ["ManageChannels"];
    public botPermissions: PermissionResolvable = ["ManageChannels"];
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<SlowModeCommandDTO>): Promise<CommandExecutionResult> {
        if(ctx.args.time > 21600000) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.tooLongDuration}
            }
        }
        await ctx.channel.setRateLimitPerUser(ctx.args.time/1000)
        ctx.response.parse({
            emoji: this.client.cache.emojis.slowmode,
            slowmode: TimeParser.stringify(ctx.args.time, ctx.settings.language.interface)
        })
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .setDescription(ctx.response.data.embed.description)
        return {reply: {embeds: [embed]}}
    }
}