import AbstractService from "@/abstractions/AbstractService";
import {EmbedBuilder, GuildTextBasedChannel, Message} from "discord.js";
import endings from "@/properties/endings.json";
import PropertyParser from "@/services/PropertyParser";
import Settings from "@/types/database/Settings";
import Ban from "@/types/database/Ban";

export default class BanEnding extends AbstractService {
    constructor(public ban: Ban) {
        super();
    }

    public async end(): Promise<any> {
        let guild = this.client.guilds.cache.get(this.ban.guildid);
        if(!guild) return;
        let ban = await guild.bans.fetch(this.ban.userid).catch(() => null);
        if(!ban) return this.ban.remove();
        await guild.bans.remove(ban.user);
        let settings = await this.db.manager.findOneBy(Settings, {guildid: this.ban.guildid})
        const props = new PropertyParser(endings.Ban[settings?.language?.interface ?? 'en']);
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.success)
            .setAuthor({name: props.data.embed.author + ' ' + ban.user.tag, iconURL: ban.user.displayAvatarURL()})
            .addFields({
                name: props.data.embed.user,
                value: ban.user.toString()
            })
            .setFooter({text: props.data.embed.footer + ' ' + `#${this.ban.casenum}`})
        let logChannel = guild.channels.cache.get(settings?.logs?.channels?.moderation) as GuildTextBasedChannel;
        if(logChannel) await logChannel.send({embeds: [embed]});
        return this.ban.remove();
    }
}