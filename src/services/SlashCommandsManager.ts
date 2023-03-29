import GuildLanguage from "@/types/GuildLanguage";
import Discord, {
    ApplicationCommandOption,
    ApplicationCommandOptionData, BaseApplicationCommandOptionsData,
    ChatInputApplicationCommandData
} from "discord.js";
import Settings from "@/types/database/Settings";
import CommandSettings from "@/types/commands/CommandSettings";
import GuildSettings from "@/utils/GuildSettings";
import Client from "@/structures/Client";
import MongoDB from "@/structures/MongoDB";
import AbstractService from "@/abstractions/AbstractService";
import CommandOption from "@/types/commands/CommandOption";
import GuildSettingsCache from "@/types/GuildSettingsCache";

export default class SlashCommandsManager extends AbstractService {
    public language: GuildLanguage

    constructor(public guildId: string) {
        super()
    }

    public async set(): Promise<void> {
        let settings = this.client.cache.settings.get(this.guildId)
        this.language = {
            commands: settings?.language?.commands ?? "en",
            interface: settings?.language?.interface ?? "en"
        }

        let commands: Array<ChatInputApplicationCommandData> = [];

        this.client.cache.commands.forEach(cmd => {
            let options = this.parseOptions(cmd.options);

            commands.push({
                name: cmd.config[this.language.commands].name,
                description: cmd.config[this.language.interface].description,
                options: options,
                defaultMemberPermissions: cmd.defaultMemberPermissions ?? null
            })

        })

        await this.client.guilds.cache.get(this.guildId).commands.set(commands).catch(() => {});
    }

    public async clear(): Promise<void> {
        await this.client.guilds.cache.get(this.guildId).commands.set([]).catch(() => {});
    }

    private parseOptions(options: Array<CommandOption>): Array<ApplicationCommandOption> {
        return options?.map(option => {return {
            type: option.type,
            name: option.config[this.language.commands].name,
            description: option.config[this.language.interface].description,
            choices: option.config[this.language.interface].choices ?? [],
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