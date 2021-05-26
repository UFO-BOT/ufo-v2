import Discord from "discord.js";

import AbstractCommand from "@/abstractions/AbstractCommand";
import ICommand from "@/interfaces/CommandInterface";

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

    public async execute(message: Discord.Message): Promise<void> {
        await message.reply('поздравляю с созданием первой команды ;)')
    }
}