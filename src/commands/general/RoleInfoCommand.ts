import Discord from "discord.js";
import moment from "moment";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import ICommand from "@/interfaces/CommandInterface";
import ICommandMessage from "@/interfaces/CommandMessage";

import Resolver from "@/utils/Resolver";
import CommandError from "@/utils/CommandError";

import replies from '@/properties/replies.json'

export default class StatsCommand extends AbstractCommand implements ICommand {
    public ru = {
        name: 'роль-инфо',
        aliases: ['рольинфо', 'роль-информация'],
        category: 'Основное',
        description: 'Показывает информацию об указанной роли',
        usage: 'роль-инфо <роль>'
    }
    public en = {
        name: 'role-info',
        aliases: ['roleinfo', 'role-information'],
        category: 'General',
        description: 'Shows information about specified role',
        usage: 'role-info <role>'
    }
    public requiredArgs = 1

    public async execute(cmd: ICommandMessage) {
        const reply = replies["role-info"][cmd.language.interface];

        let role = await Resolver.role(cmd.message, cmd.args[0]);
        if(!role) {
            return CommandError.other(cmd.message, reply.errors.roleNotFound, cmd.language.interface);
        }
        let color = '#3882f8';
        if(role.hexColor != '#000000') color = role.hexColor;
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(reply.embed.title)
            .addField(reply.embed.name, role.name, true)
            .addField(reply.embed.color, role.hexColor, true)
            .addField(reply.embed.position, role.position + '/' +  cmd.message.guild.roles.cache.size, true)
            .addField(reply.embed.members, role.members.size, true)
            .addField(reply.embed.mentionable, role.mentionable ? reply.embed.yes : reply.embed.no, true)
            .addField(reply.embed.hoist, role.hoist ? reply.embed.yes : reply.embed.yes, true)
            .addField(reply.embed.creationDate, moment(role.createdTimestamp).utc().format('D.MM.YYYY, `kk:mm:ss`') + '(GMT+0000)')
        return cmd.message.channel.send(embed);
    }
}