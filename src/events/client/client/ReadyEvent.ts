import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";

export default class ReadyEvent extends AbstractClientEvent implements EventConfig {
    public name = 'ready'

    public async execute(): Promise<any> {
        console.log(`[SHARD] Bot ${global.client.user?.tag} is online`)
        await global.client.activity()
    }
}