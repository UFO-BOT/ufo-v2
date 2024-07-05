import {ApplicationCommandOptionType, EmbedBuilder} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";

import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import MakeError from "@/utils/MakeError";
import CommandUsage from "@/utils/CommandUsage";

interface HelpCommandDTO {
    commandCategory: string
}

export default class HelpCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "хелп",
            description: 'Помощь в использовании бота или отдельной команды/категории',
            aliases: ['помощь', 'команды', 'х']
        },
        en: {
            name: "help",
            description: 'Help in using the bot or specified command/category',
            aliases: ['docs', 'commands', 'h']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.String,
            name: "commandCategory",
            config: {
                ru: {
                    name: "команда_категория",
                    description: "Команда или категория для просмотра информации"
                },
                en: {
                    name: "command_category",
                    description: "Command or category to view information"
                }
            },
            required: false
        }
    ]
    public category = CommandCategory.General;

    public async execute(ctx: CommandExecutionContext<HelpCommandDTO>): Promise<CommandExecutionResult> {
        ctx.response.parse({
            helpCommand: ctx.settings.prefix + this.config[ctx.settings.language.commands].name
        })
        let dev = await this.client.users.fetch('591321756799598592')
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setFooter({
                text: `${ctx.response.data.embed.footer} ${dev.username} © ${new Date().getFullYear()}`,
                iconURL: dev.avatarURL()
            })
        if (ctx.args.commandCategory) return {reply: {embeds: [this.commandCategory(ctx, embed)]}}
        embed
            .setTitle(ctx.response.data.embed.title)
            .setDescription(ctx.response.data.embed.description)
            .setThumbnail(this.client.user.avatarURL())
        for (let category in ctx.response.data.categories) {
            let emoji = ctx.response.data.emojis[category] as string
            let categoryName = emoji + " " + ctx.response.data.categories[category] as string
            embed.addFields({
                name: categoryName,
                value: this.client.cache.commands.filter(cmd => cmd.category === category)
                    .map(cmd => "`" + ctx.settings.prefix + cmd.config[ctx.settings.language.commands].name + "`")
                    .join(" ")
            })
        }
        return {reply: {embeds: [embed]}};
    }

    private commandCategory(ctx: CommandExecutionContext<HelpCommandDTO>, embed: EmbedBuilder): EmbedBuilder {
        let lang = ctx.settings.language;
        let command = this.client.cache.commands
            .find(cmd => cmd.config[lang.commands].name === ctx.args.commandCategory.toLowerCase() ||
                cmd.config[lang.commands].aliases.includes(ctx.args.commandCategory.toLowerCase()))
        let categoryName = Object.keys(ctx.response.data.categories)
            .find(key => ctx.response.data.categories[key].toLowerCase() === ctx.args.commandCategory.toLowerCase())
        let categoryValue = ctx.response.data.emojis[categoryName] + ctx.response.data.categories[categoryName];
        let category = this.client.cache.commands.find(cmd => cmd.category === categoryName);
        if (command) {
            embed
                .setTitle(command.config[lang.commands].name.toUpperCase())
                .setDescription(command.config[lang.interface].description)
            embed
                .addFields({
                    name: ctx.response.data.embed.usage,
                    value: CommandUsage(command, ctx.settings.prefix, lang.commands)
                })
                .addFields({
                    name: ctx.response.data.embed.aliases,
                    value: command.config[lang.commands].aliases
                        .map(a => "`" + ctx.settings.prefix + a + "`").join(" ")
                })
        } else if (category) embed
            .setTitle(categoryValue)
            .setDescription(this.client.cache.commands.filter(cmd => cmd.category === categoryName)
                .map(cmd => "`" + ctx.settings.prefix + cmd.config[lang.commands].name + "`")
                .join("\n"))
        else embed = MakeError.other(ctx.member, ctx.settings, {text: ctx.response.data.errors.commandNotFound})
        return embed;
    }
}