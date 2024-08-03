import {EmbedBuilder, Guild, WebhookClient} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import TimeParser from "@/utils/TimeParser";

export default class GuildCreateEvent extends AbstractClientEvent implements EventConfig {
    public name = 'guildDelete'

    public async execute(guild: Guild): Promise<any> {
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.error)
            .setAuthor({name: `The bot has been deleted from server ${guild.name}`, iconURL: guild.iconURL()})
            .addFields([
                {name: 'Member count', value: guild.memberCount.toLocaleString('en')},
                {name: 'Owner', value: guild.ownerId},
                {name: 'Creation date', value: TimeParser.formatTimestamp(guild.createdTimestamp, "f")}
            ])
            .setThumbnail(guild.iconURL() ?? null)
            .setFooter({text: `Server ID: ${guild.id}`})
            .setTimestamp()
        let hook = new WebhookClient({id: '757922293853978687', token: process.env.WEBHOOK_SERVERS})
        await hook.send({embeds: [embed]})
    }
}