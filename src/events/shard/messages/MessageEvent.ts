import Discord from "discord.js";

import IEvent from "@/interfaces/EventInterface";
import AbstractEvent from "@/abstractions/AbstractEvent"

export default class MessageEvent extends AbstractEvent implements IEvent {
    public static isEvent = true

    public name = 'message'

    public async execute(message: Discord.Message): Promise<any> {
        // All this will be replaced to the special handler
        if(!message.author) return;
        if(message.author.bot) return;
        if(message.channel.type === 'dm') return;
        if(!message.channel.permissionsFor(message.client.user!.id)?.has('SEND_MESSAGES')) return;
        if(!message.content) return;
        const prefix = '**';
        const language = 'ru';
        let messageArray = message.content.split(' ')
        while (messageArray.includes('')) {
            messageArray.splice(messageArray.indexOf(''), 1);
        }
        let cmd = messageArray[0].toLowerCase()
        if(!cmd.startsWith(prefix)) return;
        let command = global.bot.cache.commands.find(c => c[language].name === cmd.slice(prefix.length))
        if(!command) command = global.bot.cache.commands.find(c => c[language].aliases.includes(cmd.slice(prefix.length)))
        if(command) command.execute(message)
    }
}