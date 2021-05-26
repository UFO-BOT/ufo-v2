import Discord from "discord.js";

import IEvent from "@/interfaces/EventInterface";
import AbstractEvent from "@/abstractions/AbstractEvent";

export default class MessageUpdateEvent extends AbstractEvent implements IEvent {
    public static isEvent = true

    public name = 'messageUpdate'

    public async execute(oldmsg: Discord.Message, newmsg: Discord.Message): Promise<any> {
        if (newmsg.author.id === '591321756799598592') newmsg.reply(`нахуя ты изменил свое сообщение с ${oldmsg.content} на ${newmsg.content} ?`)
    }
}