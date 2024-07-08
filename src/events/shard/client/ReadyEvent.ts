import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";

export default class ReadyEvent extends AbstractClientEvent implements EventConfig {
    public name = 'ready'

    public async execute(): Promise<any> {
        console.log(`Bot ${this.client.user?.tag} is online`)
        await this.client.activity()
        let member = await this.client.guilds.cache.get("705372583478165596")?.members?.cache?.get("591321756799598592")
        if (member) this.client.emit("guildMemberAdd", member)
    }
}