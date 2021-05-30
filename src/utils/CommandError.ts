import Discord from "discord.js";

import errors from '@/properties/errors.json'

export default class CommandError {
    public static isUtil = true

    public static noMemberPermissions(message: Discord.Message, permissions: Discord.PermissionResolvable, lang: 'ru' | 'en' = 'en'): void {
        let prop = errors.noMemberPermissions[lang]
        let embed = new Discord.MessageEmbed()
            .setColor('#ff173a')
            .setAuthor(prop.embed.author, message.author.avatarURL({dynamic: true}))
            .setDescription(prop.embed.description.replace('{{perms}}', permissions.toString()))
        message.channel.send(embed)
    }

    public static certainRoles(message: Discord.Message, lang: 'ru' | 'en' = 'en'): void {
        let prop = errors.certainRoles[lang]
        let embed = new Discord.MessageEmbed()
            .setColor('#ff173a')
            .setAuthor(prop.embed.author, message.author.avatarURL({dynamic: true}))
            .setDescription(prop.embed.description)
        message.channel.send(embed)
    }

    public static certainChannels(message: Discord.Message, lang: 'ru' | 'en' = 'en'): void {
        let prop = errors.certainChannels[lang]
        let embed = new Discord.MessageEmbed()
            .setColor('#ff173a')
            .setAuthor(prop.embed.author, message.author.avatarURL({dynamic: true}))
            .setDescription(prop.embed.description)
        message.channel.send(embed)
    }
}