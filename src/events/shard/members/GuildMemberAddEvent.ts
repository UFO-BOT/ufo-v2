import {GuildMember, TextChannel} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import Settings from "@/types/database/Settings";
import GreetingTemplate from "@/services/templates/GreetingTemplate";
import Mute from "@/types/database/Mute";

export default class GuildMemberAddEvent extends AbstractClientEvent implements EventConfig {
    public name = 'guildMemberAdd'

    public async execute(member: GuildMember): Promise<any> {
        let mute = await this.db.manager.findOneBy(Mute, {
            guildid: member.guild.id,
            userid: member.id
        })
        if(mute) return member.roles.add(mute.muterole).catch(() => null)
        let settings = await this.db.manager.findOneBy(Settings, {guildid: member.guild.id}) as Settings;
        if (!settings?.greetings?.join?.enabled && !settings.greetings?.dm?.enabled) return;
        let template = new GreetingTemplate(member, member.guild)
        let dmMessage = template.compile(settings.greetings.dm.message)
        if (dmMessage) await member.user.send({content: dmMessage}).catch(() => {})
        let channel = member.guild.channels.cache.get(settings.greetings.join.channel) as TextChannel
        if (!channel) return
        let message = template.compile(settings.greetings.join.message)
        if (!message) return
        await channel.send({content: message}).catch(() => {})
    }
}