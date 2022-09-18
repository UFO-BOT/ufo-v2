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
import CommandOption from "@/types/commands/CommandOption";
import GuildSettingsCache from "@/types/GuildSettingsCache";

export default class SlashCommandsManager extends AbstractService {
    public guildId: string
    public settings: GuildSettingsCache

    constructor(guildId: string) {
        super()
        this.guildId = guildId;
    }

    public async set(): Promise<void> {
        if(this.client.cache.settings.get(this.guildId)) return;
        this.settings = await GuildSettingsManager.getCache(this.guildId)

        let commands: Array<ChatInputApplicationCommandData> = [];

        this.client.cache.commands.forEach(cmd => {

            let options = this.parseOptions(cmd.options);

            commands.push({
                name: cmd.config[this.settings.language.commands].name,
                description: cmd.config[this.settings.language.interface].description,
                options: options,
                defaultMemberPermissions: cmd.defaultMemberPermissions ?? null
            })

        })

        await this.client.guilds.cache.get(this.guildId).commands.set(commands);
    }

    private parseOptions(options: Array<CommandOption>): Array<ApplicationCommandOption> {
        return options?.map(option => {return {
            type: option.type,
            name: option.config[this.settings.language.commands].name,
            description: option.config[this.settings.language.interface].description,
            choices: option.config[this.settings.language.interface].choices ?? [],
            minValue: option.minValue,
            maxValue: option.maxValue,
            minLength: option.minLength,
            maxLength: option.maxLength,
            channelTypes: option.channelTypes,
            options: this.parseOptions(option.options),
            required: option.required
        }})
    }
}