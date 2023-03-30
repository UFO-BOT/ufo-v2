import {ApplicationCommandOptionType, EmbedBuilder, PermissionResolvable, User} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import Balance from "@/types/database/Balance";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";

interface BalanceManagerCommandDTO {
    member: User
    action: 'add' | 'remove' | 'set'
    amount: number
}

export default class BalanceManagerCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "сбросить-опыт",
            description: 'Сбрасывает опыт указанному участнику',
            aliases: ['сброситьопыт', 'обнулить-опыт', 'очистить-опыт']
        },
        en: {
            name: "reset-xp",
            description: 'Resets experience of specified member',
            aliases: ['resetxp', 'clear-xp']
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
                    description: "Участник для сброса опыта"
                },
                en: {
                    name: "member",
                    description: "Member to reset their xp"
                }
            },
            required: true
        }
    ]
    public category = CommandCategory.Economy;
    public defaultMemberPermissions: PermissionResolvable = ["Administrator"];
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<BalanceManagerCommandDTO>): Promise<CommandExecutionResult> {
        let balance = await this.db.manager.findOneBy(Balance, {
            guildid: ctx.guild.id,
            userid: ctx.args.member.id
        })
        if(balance) {
            balance.xp = 0;
            await balance.save()
        }
        ctx.response.parse({
            member: ctx.args.member.toString()
        })
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .setDescription(ctx.response.data.embed.description)
        return {reply: {embeds: [embed]}}
    }
}