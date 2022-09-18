import Settings from "@/types/database/Settings";
import CommandSettings from "@/types/commands/CommandSettings";
import GuildSettingsCache from "@/types/GuildSettingsCache";

import constants from "@/properties/constants.json"

export default class GuildSettingsManager {
    public static async getCache(guildId: string): Promise<GuildSettingsCache> {
        let settings: GuildSettingsCache = global.client.cache.settings.get(guildId)
        if (!settings) {
            let guildSettings = await global.db.manager.findOneBy(Settings, {guildid: guildId})

            settings = {
                prefix: guildSettings?.prefix ?? constants.defaultPrefix,
                language: {
                    commands: guildSettings?.language?.commands ?? 'en',
                    interface: guildSettings?.language?.interface ?? 'en'
                },
                boost: guildSettings?.boost,
                moneysymb: guildSettings?.moneysymb ?? constants.defaultMoneySymbol,
                commandsSettings: guildSettings?.commands ?? {} as Record<string, CommandSettings>,
                minBet: guildSettings?.minBet ?? 100
            }

            global.client.cache.settings.set(guildId, settings)
        }
        return settings;
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