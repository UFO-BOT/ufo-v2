import {EmbedBuilder, Role, TextChannel} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import Settings from "@/types/database/Settings";
import properties from "@/properties/logs.json";

export default class RoleCreateEvent extends AbstractClientEvent implements EventConfig {
    public name = 'roleCreate'

    public async execute(role: Role): Promise<any> {
        let settings = await this.db.manager.findOneBy(Settings, {guildid: role.guild.id}) as Settings
        let channel = role.guild.channels.cache
            .find(c => c.id === settings?.logs?.list?.roleCreate?.channel) as TextChannel
        if (!channel) return
        let lang = settings?.language?.interface ?? 'en'
        let props = properties.roleCreate[lang];
        let embed = new EmbedBuilder()
            .setColor("#25ff75")
            .setTitle(props.embed.title)
            .setDescription(`${props.embed.description} ${role.toString()}`)
            .addFields({name: props.embed.name, value: role.name})
            .addFields({name: props.embed.permissions, value: "права"})
            .setFooter({text: `${props.embed.id} ${role.id}`})
        return channel.send({embeds: [embed]}).catch(() => {});
    }
}