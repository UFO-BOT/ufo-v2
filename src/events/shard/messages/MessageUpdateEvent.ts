import Discord from "discord.js";

import IEvent from "@/interfaces/EventInterface";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";

export default class MessageUpdateEvent extends AbstractClientEvent implements IEvent {
    public name = 'messageUpdate'

    public async execute(oldmsg: Discord.Message, newmsg: Discord.Message): Promise<any> {

    }
}