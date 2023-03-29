import Settings from "@/types/database/Settings";
import CommandSettings from "@/types/commands/CommandSettings";
import GuildSettingsCache from "@/types/GuildSettingsCache";

import constants from "@/properties/constants.json"

export default class GuildSettings {
    public static toCache(settings: Settings): GuildSettingsCache {
        return {
            prefix: settings?.prefix ?? constants.defaultPrefix,
            language: {
                commands: settings?.language?.commands ?? 'en',
                interface: settings?.language?.interface ?? 'en'
            },
            slashCommands: settings?.slashCommands ?? true,
            textCommands: settings?.textCommands ?? true,
            moneysymb: settings?.moneysymb ?? constants.defaultMoneySymbol,
            commandsSettings: settings?.commands ?? {} as Record<string, CommandSettings>,
            minBet: settings?.minBet ?? 100,
            boost: settings?.boost
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