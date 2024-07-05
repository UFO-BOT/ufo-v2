import Discord, {EmbedBuilder, TextChannel} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import Settings from "@/types/database/Settings";
import properties from "@/properties/logs.json";

export default class MessageDeleteEvent extends AbstractClientEvent implements EventConfig {
    public name = 'messageDelete'

    public async execute(message: Discord.Message): Promise<any> {
        if(!message.author) return;
        if(!message.content?.length && message.attachments.size === 0) return;
        if(message.channel.type === Discord.ChannelType.DM) return;
        let settings = await this.db.manager.findOneBy(Settings, {guildid: message.guild.id}) as Settings
        let channel = message.guild.channels.cache
            .find(c => c.id === settings?.logs?.list?.messageDelete?.channel) as TextChannel
        if (!channel) return
        if(settings?.logs?.ignore?.channels?.includes(message.channel.id as string)) return;
        let lang = settings?.language?.interface ?? 'en'
        const props = properties.messageDelete[lang]
        let embed = new EmbedBuilder()
            .setColor("#ff9502")
            .setAuthor({
                name: props.embed.author.replace('{{author}}', message.author.username),
                iconURL: message.author.displayAvatarURL()
            })
        if (message.content) embed.addFields({name: props.embed.content, value: message.content.slice(0, 1024)})
        if (message.attachments.first()) embed.addFields({
            name: props.embed.attachments,
            value: message.attachments.map(attachment => `[${attachment.name}](${attachment.proxyURL})`).join("\n")
        })
        embed
            .addFields({
                name: props.embed.channel,
                value: `${message.channel.toString()} | ${'`' + message.channel.id + '`'}`
            })
            .addFields({
                name: props.embed.messageAuthor,
                value: `${message.author.toString()} | ${'`' + message.author.id + '`'}`
            })
            .setFooter({text: `${props.embed.id}: ${message.id}`})
            .setTimestamp()
        return channel.send({embeds: [embed]})
    }
}