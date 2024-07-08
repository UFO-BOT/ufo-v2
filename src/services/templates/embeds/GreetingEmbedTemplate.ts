import {EmbedBuilder} from "discord.js";
import GreetingMessageTemplate from "@/services/templates/messages/GreetingMessageTemplate";
import Embed from "@/types/embed/Embed";
import EmbedField from "@/types/embed/EmbedField";

export default class GreetingEmbedTemplate {
    constructor(public template: GreetingMessageTemplate) {
    }

    public compile(embedTemplate: Embed): EmbedBuilder | null {
        if (!embedTemplate?.enabled) return null
        let template = this.template
        let embed = new EmbedBuilder()
            .setColor(embedTemplate.color)
            .setAuthor({
                name: template.compile(embedTemplate.author.name),
                url: this.isUrl(template.compile(embedTemplate.author.url)) ?
                    template.compile(embedTemplate.author.url) : null,
                iconURL: this.isUrl(template.compile(embedTemplate.author.iconUrl)) ?
                    template.compile(embedTemplate.author.iconUrl) : null
            })
            .setTitle(template.compile(embedTemplate.title))
            .setURL(this.isUrl(template.compile(embedTemplate.url)) ? template.compile(embedTemplate.url) : null)
            .setDescription(template.compile(embedTemplate.description))
            .setImage(this.isUrl(template.compile(embedTemplate.image)) ? template.compile(embedTemplate.image) : null)
            .setThumbnail(this.isUrl(template.compile(embedTemplate.thumbnail)) ?
                template.compile(embedTemplate.thumbnail) : null)
            .setFooter({
                text: template.compile(embedTemplate.footer.text),
                iconURL: this.isUrl(template.compile(embedTemplate.footer.iconUrl)) ?
                    template.compile(embedTemplate.footer.iconUrl) : null
            })
        let fields: Array<EmbedField> = []
        embedTemplate.fields.forEach(field => {
            let name = template.compile(field.name).trim()
            let value = template.compile(field.value).trim()
            if (name.length && value.length) fields.push({name, value, inline: Boolean(field.inline)})
        })
        embed.addFields(fields)
        if (embedTemplate.timestamp) switch (embedTemplate.timestamp.type) {
            case "current":
                embed.setTimestamp()
                break
            case "custom":
                let date = embedTemplate.timestamp.date
                if (!isNaN(Number(date))) embed.setTimestamp(date)
                break
            case "template":
                let timestamp = new Date(Number(template.compile(embedTemplate.timestamp.template?.trim())))
                if (!isNaN(Number(timestamp))) embed.setTimestamp(timestamp)
        }
        if (!embed.data.author.name?.trim()?.length && !embed.data.title?.trim()?.length
            && !embed.data.description?.trim()?.length && !embed.data.fields.length
            && !embed.data.title?.trim()?.length && !embed.data.image.url?.trim()?.length
            && !embed.data.thumbnail.url?.trim()?.length
            && !embed.data.fields.filter(f => f.name?.trim()?.length && f.value?.trim()?.length).length
            && !embed.data.footer.text?.trim()?.length) return null
        else return embed
    }

    private isUrl(str: string): boolean {
        try {
            let url = new URL(str)
            if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
            return url.host.includes('.') || (url.hostname === 'localhost' && !isNaN(Number(url.port)))
        }
        catch (e) {
            return false
        }
    }
}