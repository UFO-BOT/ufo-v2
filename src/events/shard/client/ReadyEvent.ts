import IEvent from "@/interfaces/EventInterface";
import AbstractEvent from "@/abstractions/AbstractEvent";

export default class ReadyEvent extends AbstractEvent implements IEvent {
    public static isEvent = true

    public name = 'ready'

    public async execute(): Promise<any> {
        console.log(`[BOT] Bot ${global.bot.user?.tag} is online`)
    }
}