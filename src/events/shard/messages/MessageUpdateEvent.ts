import Discord, {EmbedBuilder, TextChannel} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import Settings from "@/types/database/Settings";
import properties from "@/properties/logs.json";

export default class MessageUpdateEvent extends AbstractClientEvent implements EventConfig {
    public name = 'messageUpdate'

    public async execute(oldMessage: Discord.Message, newMessage: Discord.Message): Promise<any> {
        if (!oldMessage?.content || !newMessage?.content) return;
        if (!oldMessage.author) return;
        if (oldMessage?.content === newMessage?.content) return;
        if (oldMessage?.channel?.type === Discord.ChannelType.DM) return;
        this.client.emit('messageCreate', newMessage)
        let settings = await this.db.manager.findOneBy(Settings, {guildid: newMessage.guild.id}) as Settings
        let channel = newMessage.guild.channels.cache
            .find(c => c.id === settings?.logs?.list?.messageEdit?.channel) as TextChannel
        if (!channel) return
        if(settings?.logs?.ignore?.channels?.includes(newMessage.channel.id as string)) return;
        let lang = settings?.language?.interface ?? 'en'
        const props = properties.messageEdit[lang]
        let embed = new EmbedBuilder()
            .setColor("#00e5ff")
            .setAuthor({
                name: props.embed.author.replace('{{author}}', newMessage.author.username),
                iconURL: newMessage.author.displayAvatarURL()
            })
            .setDescription(`[${props.embed.jump}](${newMessage.url})`)
            .addFields({name: props.embed.oldContent, value: oldMessage.content.slice(0, 1024)})
            .addFields({name: props.embed.newContent, value: newMessage.content.slice(0, 1024)})
            .addFields({
                name: props.embed.channel,
                value: `${newMessage.channel.toString()} | ${'`' + newMessage.channel.id + '`'}`
            })
            .addFields({
                name: props.embed.messageAuthor,
                value: `${newMessage.author.toString()} | ${'`' + newMessage.author.id + '`'}`
            })
            .setFooter({text: `${props.embed.id}: ${newMessage.id}`})
            .setTimestamp()
        return channel.send({embeds: [embed]})
    }
}