import GuildLanguage from "@/types/GuildLanguage";
import Discord, {
    ApplicationCommandOption,
    ApplicationCommandOptionData, BaseApplicationCommandOptionsData,
    ChatInputApplicationCommandData
} from "discord.js";
import Settings from "@/types/database/Settings";
import CommandSettings from "@/types/CommandSettings";
import GuildSettingsManager from "@/utils/GuildSettingsManager";

export default class SlashCommandsManager {
    public guildId: string

    constructor(guildId: string) {
        this.guildId = guildId;
    }

    public async set(): Promise<void> {
        let settings = await GuildSettingsManager.getCache(this.guildId)

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