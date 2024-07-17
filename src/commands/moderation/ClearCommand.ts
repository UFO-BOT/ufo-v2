import {
    ApplicationCommandOptionType, Collection,
    EmbedBuilder,
    GuildMember,
    Message,
    PermissionResolvable,
    Role, Snowflake, TextChannel,
    User
} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Language from "@/types/Language";

interface ClearCommandDTO {
    count: number
    user?: User
    role?: Role
    users?: boolean
    bots?: boolean
    mentions?: boolean
    embeds?: boolean
    attachments?: boolean
    links?: boolean
}

interface ClearCommandData extends ClearCommandDTO {
    messageId?: string
    response: any
    lang: Language
}

export default class ClearCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "очистить",
            description: 'Удаляет указанное количество сообщений в текущем канале (до 100 с фильтрами и до 1000 без)',
            aliases: ['удалить']
        },
        en: {
            name: "clear",
            description: 'Deletes specified amount of messages in current channel (up to 100 with filters and 1000 without',
            aliases: ['delete']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.Integer,
            name: "count",
            config: {
                ru: {
                    name: "количество",
                    description: "Количество сообщений"
                },
                en: {
                    name: "count",
                    description: "Count of messages"
                }
            },
            required: true
        },
        {
            type: ApplicationCommandOptionType.User,
            name: "user",
            config: {
                ru: {
                    name: "пользователь",
                    description: "Только сообщения указанного пользователя"
                },
                en: {
                    name: "user",
                    description: "Only messages from specified user"
                }
            },
            required: false
        },
        {
            type: ApplicationCommandOptionType.Role,
            name: "role",
            config: {
                ru: {
                    name: "роль",
                    description: "Только сообщения от указанной роли"
                },
                en: {
                    name: "role",
                    description: "Only messages from specified role"
                }
            },
            required: false
        },
        {
            type: ApplicationCommandOptionType.Boolean,
            name: "users",
            config: {
                ru: {
                    name: "пользователи",
                    description: "Только сообщения от пользователей"
                },
                en: {
                    name: "users",
                    description: "Only messages from users"
                }
            },
            required: false
        },
        {
            type: ApplicationCommandOptionType.Boolean,
            name: "bots",
            config: {
                ru: {
                    name: "боты",
                    description: "Только сообщения от ботов"
                },
                en: {
                    name: "bots",
                    description: "Only messages from bots"
                }
            },
            required: false
        },
        {
            type: ApplicationCommandOptionType.Boolean,
            name: "mentions",
            config: {
                ru: {
                    name: "упоминания",
                    description: "Только сообщения, содержащие упоминания"
                },
                en: {
                    name: "mentions",
                    description: "Only messages with mentions"
                }
            },
            required: false
        },
        {
            type: ApplicationCommandOptionType.Boolean,
            name: "embeds",
            config: {
                ru: {
                    name: "эмбеды",
                    description: "Только сообщения, содержащие эмбеды"
                },
                en: {
                    name: "embeds",
                    description: "Only messages with embeds"
                }
            },
            required: false
        },
        {
            type: ApplicationCommandOptionType.Boolean,
            name: "attachments",
            config: {
                ru: {
                    name: "файлы",
                    description: "Только сообщения, содержащие файлы"
                },
                en: {
                    name: "attachments",
                    description: "Only messages with attachments"
                }
            },
            required: false
        },
        {
            type: ApplicationCommandOptionType.Boolean,
            name: "links",
            config: {
                ru: {
                    name: "ссылки",
                    description: "Только сообщения, содержащие ссылки"
                },
                en: {
                    name: "links",
                    description: "Only messages with links"
                }
            },
            required: false
        }
    ]
    public category = CommandCategory.Moderation;
    public defaultMemberPermissions: PermissionResolvable = ["ManageMessages"];
    public botPermissions: PermissionResolvable = ["ManageMessages"];

    public async execute(ctx: CommandExecutionContext<ClearCommandDTO>): Promise<CommandExecutionResult> {
        if (ctx.args.count > 100 && (ctx.args.user || ctx.args.role || ctx.args.users || ctx.args.bots
            || ctx.args.mentions || ctx.args.mentions || ctx.args.attachments || ctx.args.links)) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.filtersMessagesLimit}
            }
        }
        ctx.response.parse({
            loading: this.client.cache.emojis.loading,
            check: this.client.cache.emojis.check
        })
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setDescription(ctx.response.data.embed.deleting)
        return {reply: {embeds: [embed]}, data: Object.assign(ctx.args,
                {response: ctx.response, lang: ctx.settings.language.interface, messageId: ctx.messageId})}
    }

    public async after(message: Message, data: ClearCommandData) {
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
        let lastMsg = data.messageId ?? message.id
        let deleted = 0
        while (deleted < data.count) {
            let cnt = data.count - deleted >= 100 ? 100 : data.count - deleted
            let channel = message.channel as TextChannel
            let messages = await channel.messages
                .fetch({limit: cnt, before: lastMsg}) as Collection<Snowflake, Message>
            lastMsg = messages.last().id
            messages = messages.filter(msg => Date.now() - msg.createdTimestamp < 1209600000 &&
                (!data.user || msg.author.id === data.user.id) &&
                (!data.role || msg.member?.roles?.cache?.get(data.role.id)) &&
                (!data.users || !msg.author.bot) &&
                (!data.bots || msg.author.bot) &&
                (!data.mentions || (msg.mentions.users.size || msg.mentions.roles.size)) &&
                (!data.embeds || msg.embeds.length) &&
                (!data.attachments || msg.attachments.size) &&
                (!data.links || msg.content.split(' ').find(word => this.isUrl(word)))
            )
            if (!messages.size) break
            await channel.bulkDelete(messages)
            deleted += cnt
            embed.setDescription(data.response.data.embed.deleting + ' `' + `[${deleted}/${data.count}]` + '`')
            await message.edit({embeds: [embed]}).catch(() => {})
        }
        data.response.parse({
            check: this.client.cache.emojis.check,
            count: deleted.toLocaleString(data.lang)
        })
        embed
            .setColor(this.constants.colors.success)
            .setDescription(data.response.data.embed.deleted)
        await message.edit({embeds: [embed]}).catch(() => {})
    }

    private isUrl(str: string): boolean {
        try {
            let url = new URL(str)
            return url.protocol === 'http:' || url.protocol === 'https:'
        }
        catch (e) {
            return false
        }
    }
}