import GuildLanguage from "@/types/GuildLanguage";
import Discord, {
    ApplicationCommandOptionType,
    CommandInteraction,
    CommandInteractionOption,
    GuildMember,
    InteractionReplyOptions, Message,
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
import Client from "@/structures/Client";
import MongoDB from "@/structures/MongoDB";
import GuildSettingsCache from "@/types/GuildSettingsCache";

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
        let validator = new SlashCommandsValidator(this.interaction.options.data, command.options, settings);
        let validationResult = validator.validate();
        if(!validationResult.valid) {
            await this.interaction.reply({embeds:
                    [MakeError.validationError(this.interaction.member as GuildMember, settings,
                validationResult.problemOption)],
                ephemeral: true
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
        let reply = result.reply;
        if(result.error) {
            type ErrorFunction = ((member: Discord.GuildMember, settings: GuildSettingsCache, options: {})
                => Discord.EmbedBuilder)
            let errorFn = MakeError[result.error.type] as ErrorFunction;
            reply = {
                embeds: [errorFn(this.interaction.member as GuildMember, settings, result.error.options)],
                ephemeral: true
            }
        }
        let interaction = result.interaction;
        if(interaction) {
            reply = {embeds: [interaction.embed], components: [interaction.row()]}
            global.client.cache.interactions.set(interaction.id, interaction)
            setTimeout(async () => {
                if(interaction.end) await interaction.end()
                global.client.cache.interactions.delete(interaction.id)
            }, interaction.lifetime)
        }
        let msg = (command.deferReply ?
            await this.interaction.editReply(reply) :
            await this.interaction.reply(reply as InteractionReplyOptions).catch(() => {})) as Message;
        if(command.after) {
            let message = await this.interaction.fetchReply();
            context.data = result.data;
            await command.after(context, message);
        }
        if(interaction.lifetime) setTimeout(async () => {
            if(interaction.end && global.client.cache.interactions.has(interaction.id)) {
                await interaction.end()
                await msg.edit({embeds: [interaction.embed], components: []})
            }
            global.client.cache.interactions.delete(interaction.id)
        }, interaction.lifetime)
    }
}