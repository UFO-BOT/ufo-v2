import GuildLanguage from "@/types/GuildLanguage";
import Discord, {
    ApplicationCommandOption,
    ApplicationCommandOptionData, BaseApplicationCommandOptionsData,
    ChatInputApplicationCommandData
} from "discord.js";
import Settings from "@/types/database/Settings";
import CommandSettings from "@/types/commands/CommandSettings";
import GuildSettingsManager from "@/utils/GuildSettingsManager";
import Client from "@/structures/Client";
import MongoDB from "@/structures/MongoDB";
import AbstractService from "@/abstractions/AbstractService";

export default class SlashCommandsManager extends AbstractService {
    public guildId: string

    constructor(guildId: string) {
        super()
        this.guildId = guildId;
    }

    public async set(): Promise<void> {
        if(this.client.cache.settings.get(this.guildId)) return;
        let settings = await GuildSettingsManager.getCache(this.guildId)

        let commands: Array<ChatInputApplicationCommandData> = [];

        this.client.cache.commands.forEach(cmd => {

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

        await this.client.guilds.cache.get(this.guildId).commands.set(commands);
    }
}