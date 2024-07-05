import {Guild} from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";

export default class GuildCreateEvent extends AbstractClientEvent implements EventConfig {
    public name = 'guildCreate'

    public async execute(guild: Guild): Promise<any> {
    }
}