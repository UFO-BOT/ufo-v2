import {Guild} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";

import CommandsHandler from "../../../../deleted/CommandsHandler";
import SlashCommandsManager from "@/services/SlashCommandsManager";

export default class GuildCreateEvent extends AbstractClientEvent implements EventConfig {
    public name = 'guildCreate'

    public async execute(guild: Guild): Promise<any> {
        let slashCommandsManager = new SlashCommandsManager(guild.id);
        await slashCommandsManager.set();
    }
}