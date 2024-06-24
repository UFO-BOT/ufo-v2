import AbstractService from "@/abstractions/AbstractService";
import {EmbedBuilder, GuildTextBasedChannel, Message} from "discord.js";
import Balance from "@/types/database/Balance";
import GuildSettings from "@/utils/GuildSettings";
import endings from "@/properties/endings.json";
import PropertyParser from "@/services/PropertyParser";
import Mute from "@/types/database/Mute";
import Settings from "@/types/database/Settings";

export default class MuteEnding extends AbstractService {
    constructor(public mute: Mute) {
        super();
    }

    public async end(): Promise<any> {
        let guild = this.client.guilds.cache.get(this.mute.guildid);
        if(!guild) return;
        let member = await guild.members.fetch(this.mute.userid).catch(() => null);
        if(!member) return this.mute.remove();
        let role = guild.roles.cache.get(this.mute.muterole);
        if(role) await member.roles.remove(role);
        let settings = await this.db.manager.findOneBy(Settings, {guildid: this.mute.guildid})
        const props = new PropertyParser(endings.Mute[settings?.language?.interface ?? 'en']);
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.success)
            .setAuthor({name: props.data.embed.author + ' ' + member.user.tag, iconURL: member.displayAvatarURL()})
            .addFields({
                name: props.data.embed.user,
                value: member.toString()
            })
            .setFooter({text: props.data.embed.footer + ' ' + `#${this.mute.casenum}`})
        let logChannel = guild.channels.cache.get(settings?.logs?.list?.moderationMute?.channel) as GuildTextBasedChannel;
        if(logChannel) await logChannel.send({embeds: [embed]});
        return this.mute.remove();
    }
}