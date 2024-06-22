import {ApplicationCommandOptionType, calculateUserDefaultAvatarIndex, EmbedBuilder, User} from "discord.js";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/commands/Command";

import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Language from "@/types/Language";

interface AvatarCommandDTO {
    user?: User
}

export default class AvatarCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "аватар",
            description: 'Отправляет оригинал аватарки указанного пользователя или пользователя, вызвавшего эту команду',
            aliases: ['ава', 'аватарка']
        },
        en: {
            name: "avatar",
            description: 'Sends the original avatar of specified user or user who used this command',
            aliases: ['avatar-url', 'avatar-image']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.User,
            name: "user",
            config: {
                ru: {
                    name: "пользователь",
                    description: "Пользователь для получения аватарки"
                },
                en: {
                    name: "user",
                    description: "User to get their avatar"
                }
            },
            required: false
        }
    ]
    public category = CommandCategory.Utilities;

    public async execute(ctx: CommandExecutionContext<AvatarCommandDTO>): Promise<CommandExecutionResult> {
        let user = ctx.args.user;
        if(!user) user = ctx.member.user;
        ctx.response.parse({
            user: user.tag
        })
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setTitle(ctx.response.data.embed.title)
        if(user.avatarURL()) {
            embed.setDescription(`\n[WEBP](${user.avatarURL({size: 1024, extension: 'webp'})}) | ` +
                `[JPG](${user.avatarURL({size: 1024, extension: 'jpg'})}) | ` +
                `[PNG](${user.avatarURL({size: 1024, extension: 'png'})}) ` +
                `${user.avatar.startsWith('a_') ? ` | [GIF](${user.avatarURL({size: 1024, extension: 'gif'})})` : ''}`)
            embed.setImage(user.avatarURL({size: 1024}))
        }
        else embed.setImage(user.displayAvatarURL({size: 1024, extension: 'jpg'}))
        return {reply: {embeds: [embed]}}
    }
}