import Discord from "discord.js";

import AbstractCommand from "@/abstractions/AbstractCommand";
import ICommand from "@/interfaces/CommandInterface";
import ICommandMessage from "@/interfaces/CommandMessage";

export default class HelpCommand extends AbstractCommand implements ICommand {
    public static isCommand = true

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

    public async execute(cmd: ICommandMessage): Promise<void> {
        let embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`
                Префикс: ${cmd.prefix}
                Аргументы: ${cmd.args}
                Язык: команд: ${cmd.language.commands} интерфейса: ${cmd.language.interface}
                Символ денег: ${cmd.moneysymb}
            `)
        cmd.message.channel.send(embed)
    }
}