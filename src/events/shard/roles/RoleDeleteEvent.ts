import {EmbedBuilder, Role, TextChannel} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import Settings from "@/types/database/Settings";
import properties from "@/properties/logs.json";
import permissions from "@/properties/permissions.json";

export default class RoleDeleteEvent extends AbstractClientEvent implements EventConfig {
    public name = 'roleDelete'

    public async execute(role: Role): Promise<any> {
        let settings = await this.db.manager.findOneBy(Settings, {guildid: role.guild.id}) as Settings
        let channel = role.guild.channels.cache
            .find(c => c.id === settings?.logs?.list?.roleCreate?.channel) as TextChannel
        if (!channel) return
        let lang = settings?.language?.interface ?? 'en'
        let props = properties.roleDelete[lang];
        type bool = keyof typeof props.embed.boolean
        let embed = new EmbedBuilder()
            .setColor("#ff0015")
            .setTitle(props.embed.title)
            .setDescription(`${props.embed.description} ${'`' + role.toString() + '`'}`)
            .addFields({name: props.embed.name, value: role.name})
            .addFields({name: props.embed.color, value: role.hexColor, inline: true})
            .addFields({name: props.embed.mentionable,
                value: props.embed.boolean[String(role.mentionable) as bool], inline: true})
            .addFields({name: props.embed.hoist,
                value: props.embed.boolean[String(role.hoist) as bool], inline: true})
            .addFields({
                name: props.embed.permissions,
                value: role.permissions.toArray()
                    .map(perm => permissions[lang][perm as keyof typeof permissions.en]).join(", ")
            })
            .setFooter({text: `${props.embed.id} ${role.id}`})
        return channel.send({embeds: [embed]}).catch(() => {});
    }
}