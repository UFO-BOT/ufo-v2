import {ApplicationCommandOptionType, GuildMember, Message} from "discord.js";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import Case from "@/types/database/Case";
import ModAction from "@/types/ModAction";
import WarnsInteraction from "@/interactions/WarnsInteraction";

interface WarnsCommandDTO {
    member?: GuildMember
}

export default class WarnsCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "преды",
            description: 'Показывает все ваши предупреждения или указанного участника',
            aliases: ['предупреждения']
        },
        en: {
            name: "warns",
            description: 'Shows all your warnings or specified member warnings',
            aliases: ['warnings']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.User,
            validationType: CommandOptionValidationType.GuildMember,
            name: "member",
            config: {
                ru: {
                    name: "участник",
                    description: "Участник для просмотра предупреждений"
                },
                en: {
                    name: "member",
                    description: "Member to view warnings"
                }
            },
            required: false
        }
    ]
    public category = CommandCategory.Moderation;
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<WarnsCommandDTO>): Promise<CommandExecutionResult> {
        let member = ctx.args.member ?? ctx.member;
        let actions = await this.db.mongoManager.find(Case, {where: {
            guildid: ctx.guild.id,
            userid: member.id,
            action: ModAction.Warn
        }})
        let interaction = new WarnsInteraction([ctx.member.id], {
            member: member,
            warns: actions,
            page: 1,
            maxPage: Math.ceil(actions.length/5)
        }, ctx.settings)
        await interaction.setWarns();
        return {interaction, data: {member: ctx.args.member}}
    }
}