import Discord from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import CommandMessage from "@/types/CommandMessage";
import permissionsParser from "@/utils/permissionsParser";
import TimeParser from "@/utils/TimeParser";

import errors from '@/properties/errors.json'

export default class CommandError {
    public static boostRequired(cmd: CommandMessage): void {
        let prop = errors.boostRequired[cmd.language.interface]
        let embed = new Discord.MessageEmbed()
            .setColor(cmd.color.system)
            .setDescription(prop.embed.description)
        cmd.message.channel.send(embed)
    }

    public static invalidUsage(cmd: CommandMessage, command: AbstractCommand): void {
        let prop = errors.invalidUsage[cmd.language.interface]
        let embed = new Discord.MessageEmbed()
            .setColor(cmd.color.error)
            .setAuthor(prop.embed.author, cmd.message.author.avatarURL({dynamic: true}))
            .setDescription(prop.embed.description)
            .addField(prop.embed.field, '`' + command[cmd.language.commands].usage + '`')
        cmd.message.channel.send(embed)
    }

    public static noMemberPermissions(cmd: CommandMessage, permissions: Array<Discord.PermissionString>): void {
        let prop = errors.noMemberPermissions[cmd.language.interface]
        let embed = new Discord.MessageEmbed()
            .setColor(cmd.color.error)
            .setAuthor(prop.embed.author, cmd.message.author.avatarURL({dynamic: true}))
            .setDescription(prop.embed.description.replace('{{perms}}', '`' +
                permissionsParser(permissions, cmd.language.interface).join("`, `")) + '`')
        cmd.message.channel.send(embed)
    }

    public static certainRoles(cmd: CommandMessage): void {
        let prop = errors.certainRoles[cmd.language.interface]
        let embed = new Discord.MessageEmbed()
            .setColor(cmd.color.error)
            .setAuthor(prop.embed.author, cmd.message.author.avatarURL({dynamic: true}))
            .setDescription(prop.embed.description)
        cmd.message.channel.send(embed)
    }

    public static certainChannels(cmd: CommandMessage): void {
        let prop = errors.certainChannels[cmd.language.interface]
        let embed = new Discord.MessageEmbed()
            .setColor(cmd.color.error)
            .setAuthor(prop.embed.author, cmd.message.author.avatarURL({dynamic: true}))
            .setDescription(prop.embed.description)
        cmd.message.channel.send(embed)
    }

    public static userCooldown(cmd: CommandMessage, cooldown: number): void {
        let prop = errors.userCooldown[cmd.language.interface]
        let embed = new Discord.MessageEmbed()
            .setColor(cmd.color.system)
            .setAuthor(prop.embed.author, cmd.message.author.avatarURL({dynamic: true}))
            .setDescription(prop.embed.description.replace('{{time}}',
                TimeParser.stringify(cooldown, cmd.language.interface, true)))
        cmd.message.channel.send(embed)
    }

    public static other(cmd: CommandMessage, text: string): void {
        let prop = errors.otherError[cmd.language.interface]
        let embed = new Discord.MessageEmbed()
            .setColor(cmd.color.error)
            .setAuthor(prop.embed.author, cmd.message.author.avatarURL({dynamic: true}))
            .setDescription(text)
        cmd.message.channel.send(embed)
    }
}