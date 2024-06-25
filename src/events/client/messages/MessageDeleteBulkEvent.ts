import Discord, {
    AttachmentBuilder,
    Collection,
    EmbedBuilder,
    Message,
    Snowflake,
    TextChannel
} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import Settings from "@/types/database/Settings";
import properties from "@/properties/logs.json";

export default class MessageDeleteBulkEvent extends AbstractClientEvent implements EventConfig {
    public name = 'messageDeleteBulk'

    public async execute(messages: Collection<Snowflake, Message>): Promise<any> {
        if(messages.first().channel.type === Discord.ChannelType.DM) return;
        let settings = await this.db.manager.findOneBy(Settings, {guildid: messages.first().guild.id}) as Settings
        let channel = messages.first().guild.channels.cache
            .find(c => c.id === settings?.logs?.list?.messageDeleteBulk?.channel) as TextChannel
        if (!channel) return
        if(settings?.logs?.ignore?.channels?.includes(messages.first().channel.id as string)) return;
        let lang = settings?.language?.interface ?? 'en'
        const props = properties.messageDeleteBulk[lang]
        let embed = new EmbedBuilder()
            .setColor('#ff0045')
            .setDescription(props.embed.author.replace('{{amount}}', String(messages.size)))
            .addFields({
                name: props.embed.channel,
                value: `${messages.first().channel.toString()} | ${'`' + messages.first().channel.id + '`'}`})
            .setTimestamp()
        channel.send({embeds: [embed]}).catch(() => {});
        let log = ''
        messages.forEach(message => {
            if (!message.content && !message.attachments.first()) return;
            if (message.content) log += message.content += "\n"
            if (message.attachments.size) log += props.file.attachments += "\n"
            let chan = message.channel as TextChannel
            log += message.attachments.map(attachment => `${attachment.name} ${attachment.proxyURL}`).join("\n")
            log += `${props.file.messageAuthor}: ${message.author.username} (${message.author.id})\n`
            log += `${props.file.channel}: #${chan.name} (${chan.id})\n`
            log += `${props.file.id}: ${message.id}\n`
            log += `${props.file.created}: ${message.createdAt.toUTCString()}\n\n`
        })
        let buffer = Buffer.from(log, 'utf-8')
        let attachment = new AttachmentBuilder(buffer, {name: `${messages.first().guild.id}.log`})
        return channel.send({files: [attachment]})
    }
}