import GuildLanguage from "@/types/GuildLanguage";
import Discord, {
    ApplicationCommandOptionType,
    CommandInteraction,
    CommandInteractionOption,
    GuildMember, Interaction,
    InteractionReplyOptions, Message,
    TextChannel
} from "discord.js";
import Settings from "@/types/database/Settings";
import CommandSettings from "@/types/commands/CommandSettings";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import PropertyParser from "@/services/PropertyParser";
import responses from "@/properties/responses.json";
import GuildSettings from "@/utils/GuildSettings";
import SlashCommandsValidator from "@/services/validators/SlashCommandsValidator";
import MakeError from "@/utils/MakeError";
import Client from "@/structures/Client";
import MongoDB from "@/structures/MongoDB";
import GuildSettingsCache from "@/types/GuildSettingsCache";
import AbstractService from "@/abstractions/AbstractService";
import SetInteraction from "@/utils/SetInteraction";

export default class InteractionsHandler extends AbstractService {
    constructor(public interaction: Interaction, public settings: GuildSettingsCache) {
        super()
    }

    public async handle(): Promise<void> {
        if(!this.interaction.isButton() && !this.interaction.isSelectMenu() && !this.interaction.isModalSubmit()) return;
        if(this.interaction.isModalSubmit() && !this.interaction.isFromMessage()) return;
        let settings = this.settings;
        let customId = this.interaction.customId.split("-");
        let id = customId[0];
        let action = customId[1];
        let interaction = this.client.cache.interactions.get(id);
        if(!interaction) {
            await this.interaction.reply({
                embeds: [MakeError.interactionUnavailable(this.interaction.member as GuildMember, settings)],
                ephemeral: true
            })
            return;
        }
        if(interaction.users?.length && !interaction.users?.includes(this.interaction.user.id)) {
            await this.interaction.reply({
                embeds: [MakeError.interactionNotAllowed(this.interaction.member as GuildMember, settings)],
                ephemeral: true
            })
            return;
        }
        let result = await interaction.execute(this.interaction, action)
        if(result.error) {
            type ErrorFunction = ((member: Discord.GuildMember, settings: GuildSettingsCache, options: {})
                => Discord.EmbedBuilder)
            let errorFn = MakeError[result.error.type] as ErrorFunction;
            await this.interaction.reply({
                embeds: [errorFn(this.interaction.member as GuildMember, settings, result.error.options)],
                ephemeral: true
            })
            return;
        }
        if(result.modal && !this.interaction.isModalSubmit()) {
            await this.interaction.showModal(result.modal);
            return;
        }
        let options = {
            embeds: [interaction.embed],
            components: result.ended ? [] : [interaction.row()],
            ephemeral: result.ephemeral
        }
        if(result.interaction) {
            options = {
                embeds: [result.interaction.embed],
                components: [result.interaction.row()],
                ephemeral: result.ephemeral
            }
        }
        if(result) {
            type fn = (options: InteractionReplyOptions) => Promise<Message>;
            await (this.interaction[result.action] as fn)(options);
            let message = await this.interaction.fetchReply();
            if(result.interaction) SetInteraction(this.client, result.interaction, message);
            if(result.ended) this.client.cache.interactions.delete(interaction.id);
        }
    }
}