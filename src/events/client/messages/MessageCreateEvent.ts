import Discord from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import TextCommandsHandler from "@/services/handlers/TextCommandsHandler";
import AutoModerationInvites from "@/services/automod/filters/AutoModerationInvites";
import Case from "@/types/database/Case";

export default class MessageCreateEvent extends AbstractClientEvent implements EventConfig {
    public name = 'messageCreate'

    public async execute(message: Discord.Message): Promise<any> {
        if(!message.author) return;
        if(message.author.bot) return;
        if(!message.content?.length) return;
        if(message.channel.type === Discord.ChannelType.DM) return;
        if(!message.channel.permissionsFor(message.client.user.id)?.has(['SendMessages', 'AttachFiles'])) return;
        let automodInvites = new AutoModerationInvites(message)
        await automodInvites.execute()
        let handler = new TextCommandsHandler(message);
        return handler.handle();
    }
}