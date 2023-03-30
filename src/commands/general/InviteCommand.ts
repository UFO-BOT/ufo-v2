import {ApplicationCommandOptionType, EmbedBuilder, GuildMember} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";

export default class InviteCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "пригласить",
            description: 'Отправляет ссылку на добавление бота к себе на сервер',
            aliases: ['добавить', 'добавить-бота', 'инвайт']
        },
        en: {
            name: "invite",
            description: 'Sends a link to add the bot to your server',
            aliases: ['add-bot', 'invite-bot']
        }
    }
    public options: Array<CommandOption> = []
    public category = CommandCategory.General;

    public async execute(ctx: CommandExecutionContext): Promise<CommandExecutionResult> {
        ctx.response.parse({
            invite: `https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}` +
                `&redirect_uri=${encodeURIComponent(process.env.WEBSITE + '/landing')}` +
                `&response_type=code&permissions=1515519995134&scope=bot%20applications.commands`
        });
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setDescription(ctx.response.data.embed.description)
        return {reply: {embeds: [embed]}};
    }
}