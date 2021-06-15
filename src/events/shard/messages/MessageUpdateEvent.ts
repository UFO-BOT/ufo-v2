import Discord from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";

export default class MessageUpdateEvent extends AbstractClientEvent implements EventConfig {
    public name = 'messageUpdate'

    public async execute(oldMessage: Discord.Message, newMessage: Discord.Message): Promise<any> {
        if (!oldMessage.content || !newMessage.content) return;
        if (!oldMessage.author) return;
        if (oldMessage.content === newMessage.content) return;
        if (oldMessage.channel.type === "dm") return;
        global.bot.emit('message', newMessage)
    }
}