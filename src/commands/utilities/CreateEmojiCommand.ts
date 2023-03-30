import {ApplicationCommandOptionType, Attachment, PermissionResolvable} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";

import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";

interface CreateEmojiCommandDTO {
    name: string
    image?: Attachment
    url?: string
}

export default class CreateEmojiCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "создать-эмодзи",
            description: 'Создает эмодзи из указанной картинки и устанавливает ему имя',
            aliases: ['создатьэмодзи', 'сэ', 'добавить-эмодзи']
        },
        en: {
            name: "create-emote",
            description: 'Creates an emote from specified image and sets it a name',
            aliases: ['createemote', 'create-emoji', 'ce']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.String,
            name: "name",
            config: {
                ru: {
                    name: "название",
                    description: "Название для эмодзи"
                },
                en: {
                    name: "name",
                    description: "Name for emote"
                }
            },
            minLength: 2,
            maxLength: 32,
            required: true
        },
        {
            type: ApplicationCommandOptionType.Attachment,
            name: "image",
            config: {
                ru: {
                    name: "изображение",
                    description: "Изображение для создания эмодзи"
                },
                en: {
                    name: "image",
                    description: "Image to create an emote"
                }
            },
            required: false
        },
        {
            type: ApplicationCommandOptionType.String,
            name: "url",
            config: {
                ru: {
                    name: "url",
                    description: "Или ссылка на изображение"
                },
                en: {
                    name: "url",
                    description: "Or a link to image"
                }
            },
            required: false
        },
    ]
    public category = CommandCategory.Utilities;
    public defaultMemberPermissions: PermissionResolvable = ["ManageEmojisAndStickers"];
    public botPermissions: PermissionResolvable = ["ManageEmojisAndStickers"];
    public deferReply = true

    public async execute(ctx: CommandExecutionContext<CreateEmojiCommandDTO>): Promise<CommandExecutionResult> {
        let name = ctx.args.name;
        let image = ctx.args.image;
        let url = ctx.args.url;
        let response: CommandExecutionResult;
        if (!image && !url) {
            return {
                error: {
                    type: "other",
                    options: {text: ctx.response.data.errors.noImage}
                }
            }
        }
        await ctx.guild.emojis.create({name: name, attachment: image?.url ?? url})
            .then(emoji => {
                response = {reply: {content: emoji.toString()}};
            })
            .catch(err => {
                if (err) {
                    err.message = err.message.toLowerCase();
                    let error;
                    if (err.message.includes('reached')) {
                        error = ctx.response.data.errors.emojisLimit
                    } else if (err.message.includes('must be a')) {
                        error = ctx.response.data.errors.invalidImage
                    } else if (err.message.includes('size')) {
                        error = ctx.response.data.errors.imageTooLarge
                    } else {
                        error = ctx.response.data.errors.unknownError
                    }
                    response = {
                        error: {
                            type: "other",
                            options: {text: error}
                        }
                    }
                }
            })
        return response;
    }
}