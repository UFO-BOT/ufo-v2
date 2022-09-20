import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import Balance from "@/types/database/Balance";

export default class ReadyEvent extends AbstractClientEvent implements EventConfig {
    public name = 'ready'

    public async execute(): Promise<any> {
        console.log(`Bot ${this.client.user?.tag} is online`)
        await this.client.activity()
    }
}