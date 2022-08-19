import GuildLanguage from "@/types/GuildLanguage";
import Discord, {
    ApplicationCommandOptionType,
    CommandInteraction,
    CommandInteractionOption,
    GuildMember,
    InteractionReplyOptions,
    TextChannel
} from "discord.js";
import Settings from "@/types/database/Settings";
import CommandSettings from "@/types/CommandSettings";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import PropertyParser from "@/services/PropertyParser";
import responses from "@/properties/responses.json";
import GuildSettingsManager from "@/utils/GuildSettingsManager";
import SlashCommandsValidator from "@/services/validators/SlashCommandsValidator";
import MakeError from "@/utils/MakeError";

export default class SlashCommandsHandler {
    public interaction: CommandInteraction

    constructor(interaction: CommandInteraction) {
        this.interaction = interaction;
    }

    public async handle(): Promise<void> {
        let command = global.client.cache.commands.find(cmd =>
            cmd.config.en.name === this.interaction.commandName ||
            cmd.config.ru.name === this.interaction.commandName);
        if(!command) return;

        let settings = await GuildSettingsManager.getCache(this.interaction.guildId);
        let validator = new SlashCommandsValidator(this.interaction.options.data, command.options);
        let validationResult = validator.validate();
        if(!validationResult.valid) {
            await this.interaction.reply({embeds:
                    [MakeError.validationError(this.interaction.member as GuildMember,
                validationResult.problemOption, settings)]
            })
            return;
        }

        let response = responses[command.config.en.name as keyof typeof responses]?.[settings.language.interface];
        if(!response) return;

        if(command.deferReply) await this.interaction.deferReply();
        let context: CommandExecutionContext = {
            guild: this.interaction.guild,
            member: this.interaction.member as GuildMember,
            channel: this.interaction.channel as TextChannel,
            args: validationResult.args,
            response: new PropertyParser(response),
            settings: settings
        }
        let result = await command.execute(context);
        command.deferReply ?
            await this.interaction.editReply(result.reply) :
            await this.interaction.reply(result.reply as InteractionReplyOptions).catch(() => {});
        if(command.after) {
            let message = await this.interaction.fetchReply();
            context.data = result.data;
            await command.after(context, message);
        }
    }
}