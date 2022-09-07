import {
    ActionRowBuilder,
    ApplicationCommandOptionType, ButtonBuilder,
    CommandInteraction,
    EmbedBuilder,
    Role,
    SelectMenuBuilder,
    User
} from "discord.js";
import moment from "moment/moment";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/Command";
import CommandOption from "@/types/CommandOption";
import CommandCategory from "@/types/CommandCategory";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import CommandExecutionResult from "@/types/CommandExecutionResult";
import internal from "stream";
import Balance from "@/types/database/Balance";
import Settings from "@/types/database/Settings";
import MakeError from "@/utils/MakeError";
import MoneyBagsInteraction from "@/interactions/MoneyBagsInteraction";

export default class MoneyBagsCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "мешки",
            description: 'Вам нужно будет выбрать 1 из 3 мешков, в котором могут находиться как деньги, так и бомба!',
            aliases: ['мешки-с-деньгами']
        },
        en: {
            name: "moneybags",
            description: 'You will need to choose 1 of 3 bags, which can contain money or a bomb!',
            aliases: ['mb', 'moneybags-game']
        }
    }
    public options: Array<CommandOption> = []
    public category = CommandCategory.Economy;

    public async execute(ctx: CommandExecutionContext): Promise<CommandExecutionResult> {
        let settings = await global.db.manager.findOneBy(Settings, {guildid: ctx.guild.id})
        let setting = settings?.moneybags ?? {low: -500, high: 500, cooldown: 600000};
        let balance = await global.db.manager.findOneBy(Balance, {
            guildid: ctx.guild.id,
            userid: ctx.member.id
        })
        if (!balance) {
            balance = new Balance()
            balance.guildid = ctx.guild.id;
            balance.userid = ctx.member.id;
            balance.balance = 0;
            balance.xp = 0;
            balance.lastmb = 0;
            await global.db.manager.save(balance);
        }
        let timePassed = Date.now() - balance.lastmb;
        if (timePassed < setting.cooldown) return {
            error: {
                type: "userCoolDown",
                options: {time: balance.lastmb + setting.cooldown}
            }
        }
        let interaction = new MoneyBagsInteraction(
            [ctx.member.id],
            {
                member: ctx.member,
                balance: balance,
                low: setting.low,
                high: setting.high
            },
            ctx.settings)
        return {interaction: interaction};
    }
}