import GuildLanguage from "@/types/GuildLanguage";
import Discord, {
    ApplicationCommandOption,
    ApplicationCommandOptionData, BaseApplicationCommandOptionsData,
    ChatInputApplicationCommandData
} from "discord.js";
import Settings from "@/types/database/Settings";
import CommandSettings from "@/types/CommandSettings";

export default class SlashCommandsManager {
    public guildId: string

    constructor(guildId: string) {
        this.guildId = guildId;
    }

    public async set(): Promise<void> {
        let settings = global.client.cache.settings.get(this.guildId)
        if (!settings) {
            let guildSettings = await global.mongo.findOne<Settings>('settings', {guildid: this.guildId})

            settings = {
                prefix: guildSettings?.prefix ?? '!',
                language: {
                    commands: guildSettings?.language?.commands ?? 'en',
                    interface: guildSettings?.language?.interface ?? 'en'
                },
                boost: guildSettings.boost,
                moneysymb: guildSettings?.moneysymb ?? '<:money:705401895019348018>',
                commandsSettings: guildSettings?.commands ?? {} as Record<string, CommandSettings>
            }
            global.client.cache.settings.set(this.guildId, settings)
        }

        let commands: Array<ChatInputApplicationCommandData> = [];

        global.client.cache.commands.forEach(cmd => {

            let options: Array<ApplicationCommandOption> = [];
            cmd.options.forEach(option => {
                options.push({
                    type: option.type,
                    name: option.config[settings.language.commands].name,
                    description: option.config[settings.language.interface].description,
                    choices: option.config[settings.language.interface].choices ?? [],
                    minValue: option.minValue,
                    maxValue: option.maxValue,
                    minLength: option.minLength,
                    maxLength: option.maxLength,
                    channelTypes: option.channelTypes,
                    required: option.required
                })
            })

            commands.push({
                name: cmd.config[settings.language.commands].name,
                description: cmd.config[settings.language.interface].description,
                options: options,
                defaultMemberPermissions: cmd.defaultMemberPermissions ?? null
            })

        })

        await global.client.guilds.cache.get(this.guildId).commands.set(commands);
    }
}