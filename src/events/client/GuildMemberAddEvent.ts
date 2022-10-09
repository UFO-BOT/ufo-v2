import {GuildMember} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import Mute from "@/types/database/Mute";

export default class GuildMemberAddEvent extends AbstractClientEvent implements EventConfig {
    public name = 'guildMemberAdd'

    public async execute(member: GuildMember): Promise<any> {
        let mute = await this.db.manager.findOneBy(Mute, {
            guildid: member.guild.id,
            userid: member.id
        })
        if(mute) return member.roles.add(mute.muterole).catch(() => null)
    }
}