import Discord from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Language from "@/types/Language";
import GuildLanguage from "@/types/GuildLanguage";
import permissionsParser from "@/utils/permissionsParser";

import errors from '@/properties/errors.json'

export default class CommandError {
    public static boostRequired(message: Discord.Message, lang: Language = 'en'): void {
        let prop = errors.boostRequired[lang]
        let embed = new Discord.MessageEmbed()
            .setColor('#3882f8')
            .setDescription(prop.embed.description)
        message.channel.send(embed)
    }

    public static invalidUsage(message: Discord.Message, command: AbstractCommand, language: GuildLanguage): void {
        let prop = errors.invalidUsage[language.interface]
        let embed = new Discord.MessageEmbed()
            .setColor('#ff173a')
            .setAuthor(prop.embed.author, message.author.avatarURL({dynamic: true}))
            .setDescription(prop.embed.description)
            .addField(prop.embed.field, '`' + command[language.commands].usage + '`')
        message.channel.send(embed)
    }

    public static noMemberPermissions(message: Discord.Message, permissions: Array<Discord.PermissionString>, lang: Language = 'en'): void {
        let prop = errors.noMemberPermissions[lang]
        let embed = new Discord.MessageEmbed()
            .setColor('#ff173a')
            .setAuthor(prop.embed.author, message.author.avatarURL({dynamic: true}))
            .setDescription(prop.embed.description.replace('{{perms}}', '`' + permissionsParser(permissions, lang).join("`, `")) + '`')
        message.channel.send(embed)
    }

    public static certainRoles(message: Discord.Message, lang: Language = 'en'): void {
        let prop = errors.certainRoles[lang]
        let embed = new Discord.MessageEmbed()
            .setColor('#ff173a')
            .setAuthor(prop.embed.author, message.author.avatarURL({dynamic: true}))
            .setDescription(prop.embed.description)
        message.channel.send(embed)
    }

    public static certainChannels(message: Discord.Message, lang: Language = 'en'): void {
        let prop = errors.certainChannels[lang]
        let embed = new Discord.MessageEmbed()
            .setColor('#ff173a')
            .setAuthor(prop.embed.author, message.author.avatarURL({dynamic: true}))
            .setDescription(prop.embed.description)
        message.channel.send(embed)
    }

    public static other(message: Discord.Message, text: string, lang: Language = 'en'): void {
        let prop = errors.otherError[lang]
        let embed = new Discord.MessageEmbed()
            .setColor('#ff173a')
            .setAuthor(prop.embed.author, message.author.avatarURL({dynamic: true}))
            .setDescription(text)
        message.channel.send(embed)
    }
}