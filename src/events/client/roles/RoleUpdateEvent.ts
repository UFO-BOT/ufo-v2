import Discord, {EmbedBuilder, Role, TextChannel} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import Settings from "@/types/database/Settings";
import properties from "@/properties/logs.json";
import permissions from "@/properties/permissions.json"

export default class RoleUpdateEvent extends AbstractClientEvent implements EventConfig {
    public name = 'roleUpdate'

    public async execute(oldRole: Role, newRole: Role): Promise<any> {
        let addedPerms = this.findUnique(newRole.permissions.toArray(), oldRole.permissions.toArray())
        let removedPerms = this.findUnique(oldRole.permissions.toArray(), newRole.permissions.toArray())
        if (oldRole.name === newRole.name && oldRole.name === newRole.name &&
            oldRole.mentionable === newRole.mentionable && oldRole.hoist === newRole.hoist &&
            !addedPerms.length && !removedPerms.length) return
        let settings = await this.db.manager.findOneBy(Settings, {guildid: newRole.guild.id}) as Settings
        let channel = newRole.guild.channels.cache
            .find(c => c.id === settings?.logs?.list?.roleCreate?.channel) as TextChannel
        if (!channel) return
        let lang = settings?.language?.interface ?? 'en'
        let props = properties.roleEdit[lang];
        type bool = keyof typeof props.embed.boolean
        let embed = new EmbedBuilder()
            .setColor("#ffe500")
            .setTitle(props.embed.title)
            .setDescription(`${props.embed.description} ${newRole.toString()}`)
            .setFooter({text: `${props.embed.id} ${newRole.id}`})
        if (oldRole.name !== newRole.name)
            embed.addFields({name: props.embed.name, value: `${oldRole.name} ➡ ${newRole.name}`})
        if (oldRole.hexColor !== newRole.hexColor)
            embed.addFields({name: props.embed.color, value: `${oldRole.hexColor} ➡ ${newRole.hexColor}`})
        if (oldRole.mentionable !== newRole.mentionable) embed.addFields({
            name: props.embed.mentionable,
            value: `${props.embed.boolean[String(oldRole.mentionable) as bool]}` +
                ` ➡ ${props.embed.boolean[String(newRole.mentionable) as bool]}`
        })
        if (oldRole.hoist !== newRole.hoist) embed.addFields({
            name: props.embed.hoist,
            value: `${props.embed.boolean[String(oldRole.hoist) as bool]}` +
                `➡ ${props.embed.boolean[String(newRole.hoist) as bool]}`
        })
        if (addedPerms.length) embed.addFields({
            name: props.embed.addedPermissions,
            value: addedPerms.map(perm => permissions[lang][perm as keyof typeof permissions.en]).join(", ")
        })
        if (removedPerms.length) embed.addFields({
            name: props.embed.removedPermissions,
            value: removedPerms.map(perm => permissions[lang][perm as keyof typeof permissions.en]).join(", ")
        })
        return channel.send({embeds: [embed]}).catch(() => {
        });
    }

    private findUnique(arr1: Array<string>, arr2: Array<string>): Array<string> {
        let arr: Array<string> = []
        arr1.forEach(str => {
            if (!arr2.includes(str)) arr.push(str)
        })
        return arr
    }
}