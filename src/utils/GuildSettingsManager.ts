import Settings from "@/types/database/Settings";
import CommandSettings from "@/types/commands/CommandSettings";
import GuildSettingsCache from "@/types/GuildSettingsCache";

import constants from "@/properties/constants.json"

export default class GuildSettingsManager {
    public static async getCache(guildId: string): Promise<GuildSettingsCache> {
        let settings: GuildSettingsCache = global.client.cache.settings.get(guildId)
        if (!settings) {
            let guildSettings = await global.db.manager.findOneBy(Settings, {guildid: guildId})

            settings = this.toCache(guildSettings)
            global.client.cache.settings.set(guildId, settings)
        }
        return settings;
    }

    public static toCache(settings: Settings): GuildSettingsCache {
        return {
            prefix: settings?.prefix ?? constants.defaultPrefix,
            language: {
                commands: settings?.language?.commands ?? 'en',
                interface: settings?.language?.interface ?? 'en'
            },
            boost: settings?.boost,
            moneysymb: settings?.moneysymb ?? constants.defaultMoneySymbol,
            commandsSettings: settings?.commands ?? {} as Record<string, CommandSettings>,
            minBet: settings?.minBet ?? 100
        }
    }

    public static async findOrCreate(guildId: string): Promise<Settings> {
        let settings = await global.db.manager.findOneBy(Settings, {guildid: guildId});
        if(!settings) {
            settings = new Settings()
            settings.guildid = guildId;
            await global.db.manager.save(settings);
        }
        return settings;
    }
}