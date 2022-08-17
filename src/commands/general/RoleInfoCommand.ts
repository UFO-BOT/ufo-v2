import {ApplicationCommandOptionType, EmbedBuilder, Role} from "discord.js";
import moment from "moment";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/Command";

import CommandOption from "@/types/CommandOption";
import CommandCategory from "@/types/CommandCategory";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import CommandExecutionResult from "@/types/CommandExecutionResult";

interface RoleInfoCommandDTO {
    role: Role
}

export default class RoleInfoCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "роль-инфо",
            description: 'Показывает информацию об указанной роли',
            aliases: ['рольинфо', 'роль-информация']
        },
        en: {
            name: "role-info",
            description: 'Shows information about specified role',
            aliases: ['roleinfo', 'role-information']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.Role,
            name: "role",
            config: {
                ru: {
                    name: "роль",
                    description: "Роль для просмотра информации"
                },
                en: {
                    name: "role",
                    description: "Role to view information"
                }
            },
            required: true
        }
    ]
    public category = CommandCategory.General;

    public async execute(ctx: CommandExecutionContext<RoleInfoCommandDTO>): Promise<CommandExecutionResult> {
        let role = ctx.args.role;
        let color = process.env.SYSTEM_COLOR;
        if(role.hexColor != '#000000') color = role.hexColor;
        let embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(ctx.response.data.embed.title)
            .addFields([
                {name: ctx.response.data.embed.name, value: role.name, inline: true},
                {name: ctx.response.data.embed.color, value: role.hexColor, inline: true},
                {
                    name: ctx.response.data.embed.position,
                    value: (ctx.guild.roles.cache.size - role.position).toString() + '/' +  ctx.guild.roles.cache.size,
                    inline: true
                },
                {name: ctx.response.data.embed.members, value: role.members.size.toString(), inline: true},
                {
                    name: ctx.response.data.embed.mentionable,
                    value: role.mentionable ? ctx.response.data.embed.yes : ctx.response.data.embed.no,
                    inline: true
                },
                {
                    name: ctx.response.data.embed.hoist,
                    value: role.hoist ? ctx.response.data.embed.yes : ctx.response.data.embed.no,
                    inline: true
                },
                {
                    name: ctx.response.data.embed.creationDate,
                    value: moment(role.createdTimestamp).utc().format('D.MM.YYYY, `kk:mm:ss`') + '(GMT+0000)'
                }
            ])
        return {reply: {embeds: [embed]}};
    }
}