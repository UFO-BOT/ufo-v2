import Discord from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import CommandConfig from "@/types/CommandConfig";
import CommandMessage from "@/types/CommandMessage";

import replies from '@/properties/replies.json'

export default class HelpCommand extends AbstractCommand implements CommandConfig {
    public ru = {
        name: 'хелп',
        aliases: ['помощь', 'команды', 'х'],
        category: 'Основное',
        description: 'Помощь в использовании бота',
        usage: 'хелп [команда | категория]'
    }
    public en = {
        name: 'help',
        aliases: ['commands', 'h'],
        category: 'General',
        description: 'Help in using the bot',
        usage: 'help [command | category]'
    }

    public async execute(cmd: CommandMessage) {
        const reply = replies.help[cmd.language.interface];

        let embed = new Discord.MessageEmbed()
            .setColor(cmd.color.system)
            .setDescription(`Может оставить такой цвет основным?`)
        cmd.message.channel.send(embed)
    }
}