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
    public async set(): Promise<void> {
        let commands: Array<ChatInputApplicationCommandData> = [];

        this.client.cache.commands.forEach(cmd => {
            let options = this.parseOptions(cmd.options);

            commands.push({
                name: cmd.config.en.name,
                description: cmd.config.en.description,
                nameLocalizations: {
                  ru: cmd.config.ru.name
                },
                descriptionLocalizations: {
                    ru: cmd.config.ru.description
                },
                options: options,
                defaultMemberPermissions: cmd.defaultMemberPermissions ?? null
            })

        })

        await this.client.application.commands.set(commands).catch(() => {});
    }

    private parseOptions(options: Array<CommandOption>): Array<ApplicationCommandOptionData> {
        return options?.map(option => {return {
            type: option.type,
            name: option.config.en.name,
            description: option.config.en.description,
            choices: option.config.en.choices?.map(choice => {return {
                name: choice.name,
                nameLocalizations: {
                    ru: option.config.ru.choices.find(c => c.value === choice.value).name
                },
                value: choice.value
            }}),
            nameLocalizations: {
                ru: option.config.ru.name
            },
            descriptionLocalizations: {
                ru: option.config.ru.name
            },
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