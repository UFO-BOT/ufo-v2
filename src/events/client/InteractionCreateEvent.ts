import {Interaction} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";

import SlashCommandsManager from "@/services/SlashCommandsManager";
import SlashCommandsHandler from "@/services/handlers/SlashCommandsHandler";
import InteractionsHandler from "@/services/handlers/InteractionsHandler";
import GuildCacheManager from "@/services/GuildCacheManager";

export default class InteractionCreateEvent extends AbstractClientEvent implements EventConfig {
    public name = 'interactionCreate'

    public async execute(interaction: Interaction): Promise<any> {
        let guildCacheManager = new GuildCacheManager(interaction.guildId)
        let settings = await guildCacheManager.getSettings()
        if(interaction.isCommand()) {
            let handler = new SlashCommandsHandler(interaction, settings);
            await handler.handle();
        }
        else {
            let handler = new InteractionsHandler(interaction, settings);
            await handler.handle()
        }
    }
}