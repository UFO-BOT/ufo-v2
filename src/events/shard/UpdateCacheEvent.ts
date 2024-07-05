import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import Settings from "@/types/database/Settings";
import GuildSettings from "@/utils/GuildSettings";

export default class UpdateCacheEvent extends AbstractClientEvent implements EventConfig {
    public name = 'updateCache'

    public async execute(guildId: string): Promise<any> {
        let settings = await this.db.manager.findOneBy(Settings, {guildid: guildId})
        this.client.cache.settings.set(guildId, GuildSettings.toCache(settings))
    }
}