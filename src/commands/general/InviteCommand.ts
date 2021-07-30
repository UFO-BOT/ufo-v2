import Discord from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import CommandConfig from "@/types/CommandConfig";
import CommandMessage from "@/types/CommandMessage";

import replies from '@/properties/replies.json'

export default class StatsCommand extends AbstractCommand implements CommandConfig {
    public ru = {
        name: 'пригласить',
        aliases: ['добавить', 'добавить-бота', 'инвайт'],
        category: 'Основное',
        description: 'Отправляет ссылку на добавление бота к себе на сервер',
        usage: 'пригласить'
    }
    public en = {
        name: 'invite',
        aliases: ['add-bot', 'invite-bot'],
        category: 'General',
        description: 'Help in using the bot, one command or category',
        usage: 'invite'
    }

    public async execute(cmd: CommandMessage) {
        const reply = replies.invite[cmd.language.interface];

        let embed = new Discord.MessageEmbed()
            .setColor(cmd.color.system)
            .setDescription(reply.embed.description.replace('{{invite}}', process.env.BOT_INVITE))
        return cmd.message.channel.send(embed)
    }
}