import {GuildMember, TextChannel} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import Settings from "@/types/database/Settings";
import GreetingMessageTemplate from "@/services/templates/messages/GreetingMessageTemplate";
import Mute from "@/types/database/Mute";
import EmbedTemplate from "@/services/templates/embeds/EmbedTemplate";
import Subscription from "@/types/database/Subscription";

export default class GuildMemberAddEvent extends AbstractClientEvent implements EventConfig {
    public name = 'guildMemberAdd'

    public async execute(member: GuildMember): Promise<any> {
        let mute = await this.db.manager.findOneBy(Mute, {
            guildid: member.guild.id,
            userid: member.id
        })
        if(mute) return member.roles.add(mute.muterole).catch(() => null)
        if (member.guild.id === this.constants.supportGuildId) {
            let subscription = await this.db.manager.findOneBy(Subscription, {userid: member.id}) as Subscription
            if (subscription && subscription.type !== 'manager')
                await member.roles.add(this.constants.subscriptions[subscription.type].role)
        }
        let settings = await this.db.manager.findOneBy(Settings, {guildid: member.guild.id}) as Settings;
        let roles = member.guild.roles.cache.filter(r => settings?.greetings?.joinRoles?.includes(r.id))
        for (let role of roles) {
            await member.roles.add(role)
        }
        if (!settings?.greetings?.join?.enabled && !settings?.greetings?.dm?.enabled) return;
        await member.user.fetch()
        let template = new GreetingMessageTemplate(member, member.guild)
        let dmMessage = template.compile(settings.greetings.dm.message)
        let embedTemplate = new EmbedTemplate(template)
        let dmEmbed = embedTemplate.compile(settings.greetings.dm.embed)
        await member.user.send({content: dmMessage?.length ? dmMessage : '', embeds: dmEmbed ? [dmEmbed] : []})
            .catch(() => {})
        let channel = member.guild.channels.cache.get(settings.greetings.join.channel) as TextChannel
        if (!channel) return
        let message = template.compile(settings.greetings.join.message)
        let embed = embedTemplate.compile(settings.greetings.join.embed)
        if (!message && !embed) return
        return channel.send({content: message?.length ? message : '', embeds: embed ? [embed] : []}).catch(() => {})
    }
}