import Settings from "@/types/database/Settings";
import CommandSettings from "@/types/CommandSettings";
import GuildSettingsCache from "@/types/GuildSettingsCache";

export default class GuildSettingsManager {
    public static async getCache(guildId: string): Promise<GuildSettingsCache> {
        let settings: GuildSettingsCache = global.client.cache.settings.get(guildId)
        if (!settings) {
            let guildSettings = await global.mongo.manager.findOneBy(Settings, {guildid: guildId})

            settings = {
                prefix: guildSettings?.prefix ?? '!',
                language: {
                    commands: guildSettings?.language?.commands ?? 'en',
                    interface: guildSettings?.language?.interface ?? 'en'
                },
                boost: guildSettings?.boost,
                moneysymb: guildSettings?.moneysymb ?? '<:money:705401895019348018>',
                commandsSettings: guildSettings?.commands ?? {} as Record<string, CommandSettings>
            }

            global.client.cache.settings.set(guildId, settings)
        }
        return settings;
    }

    public static async findOrCreate(guildId: string): Promise<Settings> {
        let settings = await global.mongo.manager.findOneBy(Settings, {guildid: guildId});
        if(!settings) {
            settings = new Settings()
            settings.guildid = guildId;
            await global.mongo.manager.save(settings);
        }
        return settings;
    }
}