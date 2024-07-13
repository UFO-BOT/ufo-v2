import Settings from "@/types/database/Settings";
import CommandSettings from "@/types/commands/CommandSettings";
import GuildSettingsCache from "@/types/GuildSettingsCache";

import constants from "@/properties/constants.json"
import GuildAutoMod from "@/types/automod/GuildAutoMod";

export default class GuildSettings {
    public static async getCache(guildId: string): Promise<GuildSettingsCache> {
        let settings: GuildSettingsCache = global.client.cache.settings.get(guildId)
        if (!settings) {
            let guildSettings = await global.db.manager.findOneBy(Settings, {guildid: guildId})
            settings = this.toCache(guildSettings as Settings)
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
            moneysymb: settings?.moneysymb ?? constants.defaultMoneySymbol,
            commandsSettings: settings?.commands ?? {} as Record<string, CommandSettings>,
            minBet: settings?.minBet ?? 100,
            autoModeration: settings?.autoModeration ?? {} as GuildAutoMod,
            boost: settings?.boost,
            messageXp: (settings?.boost && settings?.messageXp?.chance) > 0 ? settings.messageXp : null
        }
    }

    public static async findOrCreate(guildId: string): Promise<Settings> {
        let settings = await global.db.manager.findOneBy(Settings, {guildid: guildId});
        if(!settings) {
            settings = new Settings()
            settings.guildid = guildId;
            await global.db.manager.save(settings);
        }
        return settings as Settings;
    }
}