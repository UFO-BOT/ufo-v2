import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import Gulag from "@/types/database/Gulag";

export default class ReadyEvent extends AbstractClientEvent implements EventConfig {
    public name = 'ready'

    public async execute(): Promise<any> {
        console.log(`Bot ${this.client.user?.tag} is online`)
        await this.client.activity()
        let gulags = await this.db.manager.find(Gulag) as Array<Gulag>
        gulags.forEach(gulag => this.client.cache.gulags.add(gulag.userid))
    }
}