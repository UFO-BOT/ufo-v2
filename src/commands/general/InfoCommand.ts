import {EmbedBuilder} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Language from "@/types/Language";

export default class InfoCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "инфо",
            description: 'Показывает краткую информацию о боте и ссылки на разные ресурсы',
            aliases: ['информация']
        },
        en: {
            name: "info",
            description: 'Shows short information about the bot and links to some resources',
            aliases: ['information']
        }
    }
    public options: Array<CommandOption> = []
    public category = CommandCategory.General;

    public async execute(ctx: CommandExecutionContext): Promise<CommandExecutionResult> {
        let helpCommand: Record<Language, string> = {
            ru: 'хелп',
            en: 'help'
        }
        let languageCommand: Record<Language, string> = {
            ru: 'язык',
            en: 'language'
        }
        ctx.response.parse({
            prefix: ctx.settings.prefix,
            helpCommand: helpCommand[ctx.settings.language.commands],
            language: languageCommand[ctx.settings.language.commands]
        })
        let dev = await this.client.users.fetch('591321756799598592');
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setTitle(this.client.user.username)
            .setDescription(ctx.response.data.embed.description)
            .addFields([{name: ctx.response.data.embed.links,
                 value: `[${ctx.response.data.embed.website}](https://ufobot.ru)\n` +
                `[${ctx.response.data.embed.documentation}](https://docs.ufobot.ru)\n` +
                `[${ctx.response.data.embed.invite}](${process.env.BOT_INVITE})\n` +
                `[${ctx.response.data.embed.supportserver}](${process.env.SUPPORT_SERVER})\n` +
                `[${ctx.response.data.embed.donate}](https://ufobot.ru/donate)\n` +
                `**${ctx.response.data.embed.vote}:**\n` +
                `[top.gg](https://top.gg/bot/705372408281825350)\n` +
                `[top-bots.xyz](https://top-bots.xyz/bot/705372408281825350)\n` +
                `[boticord.top](https://boticord.top/bot/705372408281825350)\n`, inline: true},
                {name: ctx.response.data.embed.about,
                value: `${ctx.response.data.embed.language}: [JavaScript (Node JS)](https://nodejs.org)\n` +
                `${ctx.response.data.embed.library}: [discord.js](https://discord.js.org)\n` +
                `${ctx.response.data.embed.database}: [MongoDB](https://www.mongodb.com)\n`, inline: true}])
            .setFooter({text: `${ctx.response.data.embed.footer} ${dev.username} © ${new Date().getFullYear()}`, iconURL: dev.avatarURL()})
        return {reply: {embeds: [embed]}}
    }
}