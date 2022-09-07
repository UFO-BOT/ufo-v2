import {Interaction} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";

import SlashCommandsManager from "@/services/SlashCommandsManager";
import SlashCommandsHandler from "@/services/handlers/SlashCommandsHandler";
import InteractionsHandler from "@/services/handlers/InteractionsHandler";

export default class InteractionCreateEvent extends AbstractClientEvent implements EventConfig {
    public name = 'interactionCreate'

    public async execute(interaction: Interaction): Promise<any> {
        let manager = new SlashCommandsManager(interaction.guildId)
        await manager.set()
        if(interaction.isCommand()) {
            let handler = new SlashCommandsHandler(interaction);
            await handler.handle();
        }
        else {
            let handler = new InteractionsHandler(interaction);
            await handler.handle()
        }
    }
}