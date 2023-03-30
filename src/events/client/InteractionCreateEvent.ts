import {Interaction} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import SlashCommandsHandler from "@/services/handlers/SlashCommandsHandler";
import InteractionsHandler from "@/services/handlers/InteractionsHandler";
import GuildSettings from "@/utils/GuildSettings";

export default class InteractionCreateEvent extends AbstractClientEvent implements EventConfig {
    public name = 'interactionCreate'

    public async execute(interaction: Interaction): Promise<any> {
        let settings = await GuildSettings.getCache(interaction.guildId)
        if(interaction.isCommand()) {
            let handler = new SlashCommandsHandler(interaction);
            await handler.handle();
        }
        else {
            let handler = new InteractionsHandler(interaction, settings);
            await handler.handle()
        }
    }
}