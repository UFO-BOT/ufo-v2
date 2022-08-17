import {ApplicationCommandOptionType, EmbedBuilder, GuildMember} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/Command";
import CommandOption from "@/types/CommandOption";
import CommandCategory from "@/types/CommandCategory";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import CommandExecutionResult from "@/types/CommandExecutionResult";

export default class InviteCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "пригласить",
            description: 'Отправляет ссылку на добавление бота к себе на сервер',
            aliases: ['добавить', 'добавить-бота', 'инвайт']
        },
        en: {
            name: "invite",
            description: 'Help in using the bot, one command or category',
            aliases: ['add-bot', 'invite-bot']
        }
    }
    public options: Array<CommandOption> = []
    public category = CommandCategory.General;

    public async execute(ctx: CommandExecutionContext): Promise<CommandExecutionResult> {
        ctx.response.parse({invite: process.env.SUPPORT_SERVER});
        let embed = new EmbedBuilder()
            .setColor(global.constants.colors.system)
            .setDescription(ctx.response.data.embed.description)
        return {reply: {embeds: [embed]}};
    }
}