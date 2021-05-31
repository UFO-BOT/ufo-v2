import Discord from "discord.js";

import IEvent from "@/interfaces/EventInterface";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";

import CommandsHandler from "@/services/CommandsHandler";

export default class MessageEvent extends AbstractClientEvent implements IEvent {
    public name = 'message'

    public async execute(message: Discord.Message): Promise<any> {
        // All this will be replaced to the special handler
        if(!message.author) return;
        if(message.author.bot) return;
        if(message.channel.type === 'dm') return;
        if(!message.channel.permissionsFor(message.client.user!.id)?.has('SEND_MESSAGES')) return;
        if(!message.content) return;
        let handler = new CommandsHandler(message)
        return handler.handle()
    }
}