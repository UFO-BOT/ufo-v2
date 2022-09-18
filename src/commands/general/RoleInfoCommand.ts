import {ApplicationCommandOptionType, EmbedBuilder, Role} from "discord.js";
import moment from "moment";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/commands/Command";

import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import TimeParser from "@/utils/TimeParser";

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
        let color = this.constants.colors.system;
        if(role.hexColor != '#000000') color = role.hexColor;
        let embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(ctx.response.data.embed.title)
            .addFields([
                {name: ctx.response.data.embed.name, value: role.name, inline: true},
                {name: ctx.response.data.embed.color, value: role.hexColor, inline: true},
                {
                    name: ctx.response.data.embed.position,
                    value: (ctx.guild.roles.cache.size - role.position)
                        .toLocaleString(ctx.settings.language.interface)+ '/' +  ctx.guild.roles.cache.size,
                    inline: true
                },
                {name: ctx.response.data.embed.members, value: role.members.size
                        .toLocaleString(ctx.settings.language.interface), inline: true},
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
                    value: TimeParser.formatTimestamp(role.createdTimestamp, "f")
                }
            ])
        return {reply: {embeds: [embed]}};
    }
}