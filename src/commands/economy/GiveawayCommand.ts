import {ApplicationCommandOptionType, EmbedBuilder, Message, PermissionResolvable} from "discord.js";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/commands/Command";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";
import Coupon from "@/types/database/Coupon";
import Balance from "@/types/database/Balance";
import Giveaway from "@/types/database/Giveaway";
import GiveawayEnding from "@/services/endings/GiveawayEnding";

interface GiveawayCommandDTO {
    amount: number
    duration: number
}

interface GiveawayCommandData {
    giveaway: Giveaway
}

export default class GiveawayCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "розыгрыш",
            description: 'Создает розыгрыш на указанное количество денег и длительность',
            aliases: ['разыграть']
        },
        en: {
            name: "giveaway",
            description: 'Creates a giveaway for specified amount of money and duration',
            aliases: ['money-giveaway']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.Integer,
            name: "amount",
            config: {
                ru: {
                    name: "количество",
                    description: "Количество денег для розыгрыша"
                },
                en: {
                    name: "amount",
                    description: "Amount of money to giveaway"
                }
            },
            required: true,
            minValue: 0
        },
        {
            type: ApplicationCommandOptionType.String,
            validationType: CommandOptionValidationType.Duration,
            name: "duration",
            config: {
                ru: {
                    name: "длительность",
                    description: "Длительность розыгрыша"
                },
                en: {
                    name: "duration",
                    description: "Giveaway duration"
                }
            },
            required: true
        }
    ]
    public defaultMemberPermissions: PermissionResolvable = ["ManageGuild"];
    public category = CommandCategory.Economy;
    public deferReply = true;

    public async execute(ctx: CommandExecutionContext<GiveawayCommandDTO>): Promise<CommandExecutionResult> {
        let count = await this.db.manager.countBy(Giveaway, {guildid: ctx.guild.id})
        let limit = ctx.settings.boost ? 25 : 10;
        ctx.response.parse({limit: limit.toString()})
        if(count >= limit) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.limit}
            }
        }
        let giveaways = await this.db.mongoManager.createCursor(Giveaway, {guildid: ctx.guild.id})
            .sort({number:-1})
            .limit(1)
            .toArray();
        let number = (giveaways[0]?.number ?? 0)+1;
        ctx.response.parse({emote: this.client.cache.emojis.giveaway})
        let ends = Date.now() + ctx.args.duration;
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author + ` #${number}`})
            .setDescription(ctx.response.data.embed.description)
            .addFields([
                {
                    name: ctx.response.data.embed.prize,
                    value: ctx.args.amount.toLocaleString(ctx.settings.language.interface),
                    inline: true
                },
                {
                    name: ctx.response.data.embed.created,
                    value: ctx.member.toString(),
                    inline: true
                }
            ])
            .setFooter({text: ctx.response.data.embed.ends})
            .setTimestamp(ends)
        let giveaway = new Giveaway()
        giveaway.guildid = ctx.guild.id
        giveaway.channel = ctx.channel.id
        giveaway.creator = ctx.member.id
        giveaway.number = number
        giveaway.prize = ctx.args.amount
        giveaway.ends = new Date(Date.now() + ctx.args.duration)
        return {reply: {embeds: [embed]}, data: {giveaway}}
    }

    public async after(message: Message, data: GiveawayCommandData) {
        data.giveaway.message = message.id;
        let time = data.giveaway.ends.getTime() - Date.now()
        if(time < 60000) data.giveaway.timeout = true;
        await this.db.manager.save(data.giveaway);
        await message.react("755726912273383484");
        if(time < 60000) {
            setTimeout(async () => {
                data.giveaway = await this.db.manager.findOneBy(Giveaway, {message: data.giveaway.message});
                if(!data.giveaway) return;
                let ending = new GiveawayEnding(data.giveaway);
                await ending.end();
            },time)
        }
    }
}