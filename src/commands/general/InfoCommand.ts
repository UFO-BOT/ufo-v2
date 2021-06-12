import Discord from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import ICommand from "@/interfaces/CommandInterface";
import ICommandMessage from "@/interfaces/CommandMessage";

import replies from '@/properties/replies.json'

export default class StatsCommand extends AbstractCommand implements ICommand {
    public ru = {
        name: 'инфо',
        aliases: ['информация'],
        category: 'Основное',
        description: 'Показывает краткую информацию о боте и ссылки на разные ресурсы',
        usage: 'стат'
    }
    public en = {
        name: 'info',
        aliases: ['information'],
        category: 'General',
        description: 'Shows short information about the bot and links to some resources',
        usage: 'stats'
    }

    public async execute(cmd: ICommandMessage) {
        const reply = replies.info[cmd.language.interface];

        let helpCommand: Record<'ru' | 'en', string> = {
            ru: 'хелп',
            en: 'help'
        }
        let languageCommand: Record<'ru' | 'en', string> = {
            ru: 'язык',
            en: 'language'
        }
        let dev = await global.bot.users.fetch('591321756799598592');
        let embed = new Discord.MessageEmbed()
            .setColor('#7900ff')
            .setTitle(global.bot.user.username)
            .setDescription(reply.embed.description
                .replace('{{prefix}}', cmd.prefix)
                .replace('{{helpCommand}}', cmd.prefix + helpCommand[cmd.language.commands])
                .replace('{{languageCommand}}', cmd.prefix + languageCommand[cmd.language.commands])
            )
            .addField(reply.embed.links, `
[${reply.embed.website}](https://ufobot.ru)
[${reply.embed.documentation}](https://docs.ufobot.ru)
[${reply.embed.invite}](${process.env.BOT_INVITE})
[${reply.embed.supportserver}](${process.env.SUPPORT_SERVER})
[${reply.embed.donate}](https://ufobot.ru/donate)
**${reply.embed.vote}:**
[top.gg](https://top.gg/bot/705372408281825350)
[bots.server-discord.com](https://bots.server-discord.com/705372408281825350)
[top-bots.xyz](https://top-bots.xyz/bot/705372408281825350)
[boticord.top](https://boticord.top/bot/705372408281825350)`, true)
            .addField(reply.embed.about, `
${reply.embed.language}: [JavaScript (Node JS)](https://nodejs.org)
${reply.embed.library}: [discord.js](https://discord.js.org)
${reply.embed.database}: [MongoDB](https://www.mongodb.com)
${reply.embed.hosting}: [GalaxyGate](https://galaxygate.net)`, true)
            .setFooter(`${reply.embed.footer} ${dev.username} © ${new Date().getFullYear()}`, dev.avatarURL({dynamic: true}))
        return cmd.message.channel.send(embed);
    }
}