import {ApplicationCommandOptionType, EmbedBuilder, PermissionResolvable, Role, User} from "discord.js";
import moment from "moment/moment";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/Command";
import CommandOption from "@/types/CommandOption";
import CommandCategory from "@/types/CommandCategory";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import CommandExecutionResult from "@/types/CommandExecutionResult";
import internal from "stream";
import Settings from "@/types/database/Settings";
import GuildSettingsManager from "@/utils/GuildSettingsManager";

interface MoneySymbolCommandDTO {
    symbol: string
}

export default class MoneySymbolCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "символ-денег",
            description: 'Устанавливает символ денег на сервере',
            aliases: ['симден', 'сд']
        },
        en: {
            name: "money-symbol",
            description: 'Sets money symbol on the server',
            aliases: ['monsym', 'ms']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.String,
            name: "symbol",
            config: {
                ru: {
                    name: "символ",
                    description: "Новый символ денег"
                },
                en: {
                    name: "symbol",
                    description: "New money symbol"
                }
            },
            required: true,
            maxLength: 50
        }
    ]
    public category = CommandCategory.Economy;
    public defaultMemberPermissions: PermissionResolvable = ["ManageGuild"];

    public async execute(ctx: CommandExecutionContext<MoneySymbolCommandDTO>): Promise<CommandExecutionResult> {
        let symbol = ctx.args.symbol;
        let settings = await GuildSettingsManager.findOrCreate(ctx.guild.id);
        settings.moneysymb = symbol;
        await settings.save();
        let settingsCache = global.client.cache.settings.get(ctx.guild.id);
        settingsCache.moneysymb = symbol;
        global.client.cache.settings.set(ctx.guild.id, settingsCache)
        ctx.response.parse({symbol: symbol});
        let embed = new EmbedBuilder()
            .setColor(global.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .setDescription(ctx.response.data.embed.description)
        return {reply: {embeds: [embed]}}
    }
}