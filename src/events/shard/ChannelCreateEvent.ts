import {GuildChannel} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import Settings from "@/types/database/Settings";

export default class ChannelCreateEvent extends AbstractClientEvent implements EventConfig {
    public name = 'channelCreate'

    public async execute(channel: GuildChannel): Promise<any> {
        let settings = await this.db.manager.findOneBy(Settings, {guildid: channel.guild.id});
        if(settings?.muterole) return channel.permissionOverwrites.create(settings.muterole, {
            SendMessages: false,
            AddReactions: false,
            ManageThreads: false,
            CreatePublicThreads: false,
            CreatePrivateThreads: false,
            SendMessagesInThreads: false,
            Connect: false
        })
    }
}