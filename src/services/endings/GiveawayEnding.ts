import AbstractService from "@/abstractions/AbstractService";
import Giveaway from "@/types/database/Giveaway";
import {EmbedBuilder, GuildTextBasedChannel, Message} from "discord.js";
import Balance from "@/types/database/Balance";
import GuildSettings from "@/utils/GuildSettings";
import endings from "@/properties/endings.json";
import PropertyParser from "@/services/PropertyParser";

export default class GiveawayEnding extends AbstractService {
    public giveaway: Giveaway

    constructor(giveaway: Giveaway) {
        super();
        this.giveaway = giveaway;
    }

    public async end(): Promise<any> {
        let channel = this.client.guilds.cache.get(this.giveaway.guildid)?.channels?.cache
            ?.get(this.giveaway.channel) as GuildTextBasedChannel;
        if(!channel) return;
        let message = await channel.messages.fetch(this.giveaway.message).catch(() => null) as Message;
        if(!message) return this.giveaway.remove();
        let settings = await GuildSettings.getCache(this.giveaway.guildid)
        const props = new PropertyParser(endings.Giveaway[settings.language.interface]);
        let rct = await message.reactions.cache.get("755726912273383484");
        if(!rct) return this.giveaway.remove();
        let embed = new EmbedBuilder()
            .setAuthor({name: props.data.embed.author + ` #${this.giveaway.number}`})
            .addFields([
                {
                    name: props.data.embed.prize,
                    value: this.giveaway.prize.toLocaleString(settings.language.interface),
                    inline: true
                },
                {
                    name: props.data.embed.created,
                    value: `<@${this.giveaway.creator}>`,
                    inline: true
                }
            ])
            .setFooter({text: props.data.embed.footer})
            .setTimestamp()
        let reaction = await rct.fetch();
        let users = await reaction.users.fetch();
        users = users.filter(u => !u.bot);
        if(users.size <= 0) {
            embed
                .setColor(this.constants.colors.error)
                .setDescription(props.data.embed.notEnoughMembers)
            await this.giveaway.remove();
            return message.edit({embeds: [embed]})
        }
        let winner = reaction.users.cache.filter(u => !u.bot).random();
        let balance = await this.db.manager.findOneBy(Balance, {
            guildid: this.giveaway.guildid,
            userid: winner.id
        })
        if (!balance) {
            balance = new Balance()
            balance.guildid = this.giveaway.guildid;
            balance.userid = winner.id;
            balance.balance = 0;
            balance.xp = 0;
            await this.db.manager.save(balance);
        }
        balance.balance += this.giveaway.prize;
        embed
            .setColor(this.constants.colors.success)
            .setDescription(`**${props.data.embed.winner}:** ${winner.toString()}`)
        props.parse({
            emote: this.client.cache.emojis.giveaway,
            winner: winner.toString(),
            prize: this.giveaway.prize.toLocaleString(settings.language.interface),
            monsymb: settings.moneysymb,
            number: this.giveaway.number.toString()
        })
        await balance.save();
        await message.edit({embeds: [embed]});
        await this.giveaway.remove();
        return channel.send({content: props.data.congratulations});
    }
}