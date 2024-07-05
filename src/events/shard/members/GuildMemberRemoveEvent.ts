import {GuildMember, TextChannel} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import Settings from "@/types/database/Settings";
import GreetingMessageTemplate from "@/services/templates/messages/GreetingMessageTemplate";

export default class GuildMemberRemoveEvent extends AbstractClientEvent implements EventConfig {
    public name = 'guildMemberRemove'

    public async execute(member: GuildMember): Promise<any> {
        let settings = await this.db.manager.findOneBy(Settings, {guildid: member.guild.id}) as Settings;
        if (!settings?.greetings?.leave?.enabled) return;
        let channel = member.guild.channels.cache.get(settings.greetings.leave.channel) as TextChannel
        if (!channel) return
        let template = new GreetingMessageTemplate(member, member.guild)
        let message = template.compile(settings.greetings.leave.message)
        if (!message) return
        await channel.send({content: message}).catch(() => {})
    }
}