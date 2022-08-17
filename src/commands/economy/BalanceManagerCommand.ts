import {ApplicationCommandOptionType, EmbedBuilder, PermissionResolvable, Role, User} from "discord.js";
import moment from "moment/moment";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/Command";
import CommandOption from "@/types/CommandOption";
import CommandCategory from "@/types/CommandCategory";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import CommandExecutionResult from "@/types/CommandExecutionResult";
import internal from "stream";
import Balance from "@/types/database/Balance";
import MakeError from "@/utils/MakeError";
import {settings} from "cluster";
import GuildSettingsManager from "@/utils/GuildSettingsManager";
import CommandOptionValidationType from "@/types/CommandOptionValidationType";

interface BalanceManagerCommandDTO {
    member: User
    action: 'add' | 'remove' | 'set'
    amount: number
}

export default class BalanceManagerCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "баланс-менеджер",
            description: 'Добавляет или забирает деньги или устанавливает баланс указанного участника',
            aliases: ['балмен', 'бм']
        },
        en: {
            name: "balance-manager",
            description: 'Adds or removes money or sets balance of specified member',
            aliases: ['balman', 'bm']
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
                    description: "Участник для управления балансом"
                },
                en: {
                    name: "member",
                    description: "Member to manage their balance"
                }
            },
            required: true
        },
        {
            type: ApplicationCommandOptionType.String,
            name: "action",
            config: {
                ru: {
                    name: "действие",
                    description: "Действие с балансом участника",
                    choices: [
                        {name: "добавить", value: "add"},
                        {name: "забрать", value: "remove"},
                        {name: "установить", value: "set"}
                    ]
                },
                en: {
                    name: "action",
                    description: "Member balance action",
                    choices: [
                        {name: "add", value: "add"},
                        {name: "remove", value: "remove"},
                        {name: "set", value: "set"}
                    ]
                }
            },
            required: true
        },
        {
            type: ApplicationCommandOptionType.Integer,
            name: "amount",
            config: {
                ru: {
                    name: "количество",
                    description: "Количество денег"
                },
                en: {
                    name: "amount",
                    description: "Amount of money"
                }
            },
            required: true
        }
    ]
    public category = CommandCategory.Economy;
    public defaultMemberPermissions: PermissionResolvable = ["Administrator"];
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<BalanceManagerCommandDTO>): Promise<CommandExecutionResult> {
        let user = ctx.args.member;
        let action = ctx.args.action;
        let amount = ctx.args.amount;
        let settings = await GuildSettingsManager.findOrCreate(ctx.guild.id);
        let balance = await global.mongo.manager.findOneBy(Balance, {
            guildid: ctx.guild.id,
            userid: user.id
        })
        if (!balance) {
            balance = new Balance()
            balance.guildid = ctx.guild.id;
            balance.userid = user.id;
            balance.balance = 0;
            await global.mongo.manager.save(balance)
        }
        ctx.response.parse({
            member: user.toString(),
            number: amount.toString(),
            monsymb: ctx.settings.moneysymb
        })
        switch (action) {
            case "add":
                balance.balance += amount;
                break;
            case "remove":
                balance.balance -= amount;
                break;
            case "set":
                balance.balance = amount;
        }
        await balance.save();
        let embed = new EmbedBuilder()
            .setColor(global.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .setDescription(ctx.response.data.embed.actions[action])
        return {reply: {embeds: [embed]}}
    }
}