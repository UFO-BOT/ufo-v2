import {ApplicationCommandOptionType} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Case from "@/types/database/Case";
import ModerationActionLog from "@/utils/ModerationActionLog";

interface CaseCommandDTO {
    number: number
}

export default class CaseCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "случай",
            description: 'Показывает информацию об указанном модераторском случае',
            aliases: ['посмотреть-случай']
        },
        en: {
            name: "case",
            description: 'Shows information about specified moderator case',
            aliases: ['view-case']
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
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<CaseCommandDTO>): Promise<CommandExecutionResult> {
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
        let embed = await ModerationActionLog(this.client, action, ctx.settings)
        return {reply: {embeds: [embed]}}
    }
}