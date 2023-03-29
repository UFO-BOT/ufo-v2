import Discord from "discord.js";

import EventConfig from "@/types/EventConfig";
import AbstractClientEvent from "@/abstractions/events/AbstractClientEvent";

import SlashCommandsManager from "@/services/SlashCommandsManager";
import TextCommandsHandler from "@/services/handlers/TextCommandsHandler";
import GuildSettings from "@/utils/GuildSettings";
import GuildCacheManager from "@/services/GuildCacheManager";

export default class MessageCreateEvent extends AbstractClientEvent implements EventConfig {
    public name = 'messageCreate'

    public async execute(message: Discord.Message): Promise<any> {
        if(!message.author) return;
        if(message.author.bot) return;
        if(!message.content?.length) return;
        if(message.channel.type === Discord.ChannelType.DM) return;
        let guildCacheManager = new GuildCacheManager(message.guildId)
        let settings = await guildCacheManager.getSettings()
        if(!message.channel.permissionsFor(message.client.user.id)?.has(['SendMessages', 'AttachFiles'])) return;
        let handler = new TextCommandsHandler(message, settings);
        return handler.handle();
    }
}