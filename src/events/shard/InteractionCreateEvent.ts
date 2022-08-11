import {Interaction} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";

import SlashCommandsManager from "@/services/SlashCommandsManager";
import SlashCommandsHandler from "@/services/SlashCommandsHandler";

export default class InteractionCreateEvent extends AbstractClientEvent implements EventConfig {
    public name = 'interactionCreate'

    public async execute(interaction: Interaction): Promise<any> {
        if(interaction.isCommand()) {
            let handler = new SlashCommandsHandler(interaction);
            await handler.handle();
        }
    }
}