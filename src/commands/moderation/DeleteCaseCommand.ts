import Discord, {ApplicationCommandOptionType, EmbedBuilder, GuildMember, PermissionResolvable, Role, User} from "discord.js";
import moment from "moment/moment";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Case from "@/types/database/Case";
import ModerationActionLog from "@/utils/ModerationActionLog";

interface DeleteCaseCommandDTO {
    number: number
}

export default class DeleteCaseCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "удалить-случай",
            description: 'Удаляет указанный модераторский случай',
            aliases: ['удалитьслучай', 'ус']
        },
        en: {
            name: "delete-case",
            description: 'Deletes specified moderator case',
            aliases: ['deletecase', 'remove-case', 'dc']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.Integer,
            name: "number",
            config: {
                ru: {
                    name: "номер",
                    description: "Номер случая"
                },
                en: {
                    name: "number",
                    description: "Case number"
                }
            },
            minValue: 1,
            required: true
        }
    ]
    public category = CommandCategory.Moderation;
    public defaultMemberPermissions: PermissionResolvable = ["ManageGuild"];
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<DeleteCaseCommandDTO>): Promise<CommandExecutionResult> {
        let action = await this.db.manager.findOneBy(Case, {
            guildid: ctx.guild.id,
            number: ctx.args.number
        })
        if(!action) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.caseNotFound}
            }
        }
        await action.remove();
        ctx.response.parse({number: action.number.toLocaleString(ctx.settings.language.interface)});
        let embed = new Discord.EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .setDescription(ctx.response.data.embed.description)
        return {reply: {embeds: [embed]}}
    }
}