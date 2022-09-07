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

export default class InteractionsHandler {
    public interaction: Interaction

    constructor(interaction: Interaction) {
        this.interaction = interaction;
    }

    public async handle(): Promise<void> {
        if(!this.interaction.isButton() && !this.interaction.isSelectMenu()) return;
        let settings = await GuildSettingsManager.getCache(this.interaction.guildId)
        let customId = this.interaction.customId.split("-");
        let id = customId[0];
        let action = customId[1];
        let interaction = global.client.cache.interactions.get(id);
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
        if(result) {
            type fn = (options: InteractionReplyOptions) => Promise<Message>;
            await (this.interaction[result.action] as fn)({
                embeds: [interaction.embed],
                components: result.ended ? [] : [interaction.row()],
                ephemeral: result.ephemeral
            });
            if(result.ended) global.client.cache.interactions.delete(interaction.id);
        }
    }
}