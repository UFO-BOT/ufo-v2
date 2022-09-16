import {EmbedBuilder, ChannelType} from "discord.js";
import moment from "moment";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/commands/Command";

import replies from '../../properties/responses.json'
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import TimeParser from "@/utils/TimeParser";

export default class ServerCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "сервер",
            description: 'Показывает информацию о сервере',
            aliases: ['сервер-инфо', 'серверинфо']
        },
        en: {
            name: "server",
            description: 'Shows information about the server',
            aliases: ['commands', 'h']
        }
    }
    public options: Array<CommandOption> = []
    public category = CommandCategory.General;

    public async execute(ctx: CommandExecutionContext): Promise<CommandExecutionResult> {
        let emojis = global.client.cache.emojis;
        let bans = await ctx.guild.bans.fetch().catch(() => undefined)
        let invites = await ctx.guild.invites.fetch().catch(() => undefined)
        let { boost } = global.client.cache.settings.get(ctx.guild.id)
        let boosts = ctx.guild.premiumSubscriptionCount ?
            `\n**<a:boost:751699949799866459> ${ctx.response.data.embed.boosts}:** ${ctx.guild.premiumSubscriptionCount}` : ''
        let splash = ctx.guild.splashURL() && ctx.guild.bannerURL() ?
            `\n[**:frame_photo: ${ctx.response.data.embed.splash}**](${ctx.guild.splashURL({extension: 'gif'})})` : ''
        let embed = new EmbedBuilder()
            .setColor(global.constants.colors.system)
            .setTitle(ctx.guild.name)
            .setDescription(`
**${emojis.verification} ${ctx.response.data.embed.verification}:** ${ctx.response.data.levels[ctx.guild.verificationLevel]}
**${emojis.owner} ${ctx.response.data.embed.owner}:** <@${ctx.guild.ownerId}>
**${emojis.invite} ${ctx.response.data.embed.invites}:** ${invites?.size ?? ctx.response.data.embed.missingPermissions}
**🔨 ${ctx.response.data.embed.bans}:** ${bans?.size ?? ctx.response.data.embed.missingPermissions} ${boosts}
**${emojis.textchannel} ${ctx.response.data.embed.shard}:** #${ctx.guild.shardId}
**🕐 ${ctx.response.data.embed.creationDate}:** ${TimeParser.formatTimestamp(ctx.guild.createdTimestamp, "f")} ${splash}`)
            .addFields({name: `${ctx.response.data.embed.channels} [${ctx.guild.channels.cache.size}]`, value: `
${emojis.textchannel} ${ctx.response.data.embed.text}: ${ctx.guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size}
${emojis.voice} ${ctx.response.data.embed.voice}: ${ctx.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size}
${emojis.announcements} ${ctx.response.data.embed.announcements}: ${ctx.guild.channels.cache.filter(c => c.type === ChannelType.GuildNews).size}
${emojis.presence} ${ctx.response.data.embed.categories}: ${ctx.guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size}
                `, inline: true})
            .addFields({name: ctx.response.data.embed.stats, value: `
${emojis.members} ${ctx.response.data.embed.memberCount}: ${ctx.guild.memberCount}
${emojis.textchannel} ${ctx.response.data.embed.channelCount}: ${ctx.guild.channels.cache.size}
${emojis.roles} ${ctx.response.data.embed.roleCount}: ${ctx.guild.roles.cache.size}
${emojis.emotes} ${ctx.response.data.embed.emojiCount}: ${ctx.guild.emojis.cache.size}`, inline: true})
            .setThumbnail(ctx.guild.iconURL())
            .setImage(ctx.guild.bannerURL({extension: 'gif'}) ?? ctx.guild.splashURL({size: 2048, extension: 'gif'}))
            .setFooter({text: `ID: ${ctx.guild.id}`});
        if(boost) embed.data.description += `\n${global.client.cache.emojis.ufoboost} ${ctx.response.data.embed.ufoboost}`
        return {reply: {embeds: [embed]}}
    }
}