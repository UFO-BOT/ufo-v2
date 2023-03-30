import {Interaction} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";
import SlashCommandsManager from "@/services/SlashCommandsManager";

export default class SlashCommandsEvent extends AbstractClientEvent implements EventConfig {
    public name = 'slashCommands'

    public async execute(interaction: Interaction): Promise<any> {
        let slashCommandsManager = new SlashCommandsManager()
        await slashCommandsManager.set()
        console.log('[COMMANDS] Slash commands updated')
    }
}