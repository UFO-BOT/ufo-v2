import AbstractService from "@/abstractions/AbstractService";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import Settings from "@/types/database/Settings";
import GuildSettings from "@/utils/GuildSettings";
import SlashCommandsManager from "@/services/SlashCommandsManager";

export default class GuildCacheManager extends AbstractService {
    public settings: GuildSettingsCache

    constructor(public guildId: string) {
        super()
    }

    public async getSettings(): Promise<GuildSettingsCache> {
        this.settings = this.client.cache.settings.get(this.guildId)
        if(!this.settings) await this.cacheGuild()
        return this.settings
    }

    public async cacheGuild(): Promise<void> {
        let guildSettings = await global.db.manager.findOneBy(Settings, {guildid: this.guildId})
        this.settings = GuildSettings.toCache(guildSettings)
        this.client.cache.settings.set(this.guildId, this.settings)
        let slashCommandsManager = new SlashCommandsManager(this.guildId)
        if(this.settings.slashCommands) await slashCommandsManager.set()
        else await slashCommandsManager.clear()
    }
}