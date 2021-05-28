import Discord from "discord.js";

import IEvent from "@/interfaces/EventInterface";
import AbstractEvent from "@/abstractions/AbstractEvent"
import ISettings from "@/interfaces/database/SettingsInterface";

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
        let prefix = global.bot.cache.prefixes.get(message.guild!.id)!;
        let language = global.bot.cache.languages.get(message.guild!.id)!;
        let moneysymb = global.bot.cache.moneysymbs.get(message.guild!.id)!;
        if(!prefix || !language || !moneysymb) {
            let settings = await global.mongo.getOne<ISettings>('settings', {guildid: message.guild?.id})
            prefix = settings?.prefix ?? '!'
            language = {
                commands: settings?.language?.commands ?? 'en',
                interface: settings?.language?.interface ?? 'en'
            }
            moneysymb = settings?.moneysymb ?? '<:money:705401895019348018>'
            global.bot.cache.prefixes.set(message.guild!.id, prefix)
            global.bot.cache.languages.set(message.guild!.id, language)
            global.bot.cache.moneysymbs.set(message.guild!.id, moneysymb)
        }
        let messageArray = message.content.split(' ')
        while (messageArray.includes('')) {
            messageArray.splice(messageArray.indexOf(''), 1);
        }
        let cmd = messageArray[0].toLowerCase()
        if(!cmd.startsWith(prefix)) return;
        let args = messageArray.slice(1)
        let command = global.bot.cache.commands.find(c => c[language?.commands ?? 'en'].name === cmd.slice(prefix.length))
        if(!command) command = global.bot.cache.commands.find(c => c[language?.interface ?? 'ru'].aliases.includes(cmd.slice(prefix.length)))
        if(command) command.execute({
            message: message,
            args: args,
            prefix: prefix,
            language: language,
            moneysymb: moneysymb
        })
    }
}