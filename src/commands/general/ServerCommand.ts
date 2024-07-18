import {ChannelType, EmbedBuilder} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";
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
        let emojis = this.client.cache.emojis;
        let bans = await ctx.guild.bans.fetch().catch(() => undefined)
        let invites = await ctx.guild.invites.fetch().catch(() => undefined)
        let { boost } = this.client.cache.settings.get(ctx.guild.id)
        let boosts = ctx.guild.premiumSubscriptionCount ?
            `\n**<a:boost:751699949799866459> ${ctx.response.data.embed.boosts}:** ${ctx.guild.premiumSubscriptionCount}` : ''
        let splash = ctx.guild.splashURL() && ctx.guild.bannerURL() ?
            `\n[**:frame_photo: ${ctx.response.data.embed.splash}**](${ctx.guild.splashURL({extension: 'gif'})})` : ''
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setTitle(ctx.guild.name)
            .setDescription(`
**${emojis.verification} ${ctx.response.data.embed.verification}:** ${ctx.response.data.levels[ctx.guild.verificationLevel]}
**${emojis.owner} ${ctx.response.data.embed.owner}:** <@${ctx.guild.ownerId}>
**${emojis.invite} ${ctx.response.data.embed.invites}:** ${invites?.size.toLocaleString(ctx.settings.language.interface) ?? ctx.response.data.embed.missingPermissions}
**🔨 ${ctx.response.data.embed.bans}:** ${bans?.size.toLocaleString(ctx.settings.language.interface) ?? ctx.response.data.embed.missingPermissions} ${boosts}
**${emojis.textchannel} ${ctx.response.data.embed.shard}:** #${ctx.guild.shardId}
**🕐 ${ctx.response.data.embed.creationDate}:** ${TimeParser.formatTimestamp(ctx.guild.createdTimestamp, "f")} ${splash}`)
            .addFields({name: `${ctx.response.data.embed.channels} [${ctx.guild.channels.cache.size.toLocaleString(ctx.settings.language.interface)}]`, value: `
${emojis.textchannel} ${ctx.response.data.embed.text}: ${ctx.guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size.toLocaleString(ctx.settings.language.interface)}
${emojis.voice} ${ctx.response.data.embed.voice}: ${ctx.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size.toLocaleString(ctx.settings.language.interface)}
${emojis.announcements} ${ctx.response.data.embed.announcements}: ${ctx.guild.channels.cache.filter(c => c.type === ChannelType.GuildNews).size.toLocaleString(ctx.settings.language.interface)}
${emojis.presence} ${ctx.response.data.embed.categories}: ${ctx.guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size.toLocaleString(ctx.settings.language.interface)}
                `, inline: true})
            .addFields({name: ctx.response.data.embed.stats, value: `
${emojis.members} ${ctx.response.data.embed.memberCount}: ${ctx.guild.memberCount.toLocaleString(ctx.settings.language.interface)}
${emojis.textchannel} ${ctx.response.data.embed.channelCount}: ${ctx.guild.channels.cache.size.toLocaleString(ctx.settings.language.interface)}
${emojis.roles} ${ctx.response.data.embed.roleCount}: ${ctx.guild.roles.cache.size.toLocaleString(ctx.settings.language.interface)}
${emojis.emotes} ${ctx.response.data.embed.emojiCount}: ${ctx.guild.emojis.cache.size.toLocaleString(ctx.settings.language.interface)}`, inline: true})
            .setThumbnail(ctx.guild.iconURL())
            .setImage(ctx.guild.bannerURL() ?? ctx.guild.splashURL({size: 2048}))
            .setFooter({text: `ID: ${ctx.guild.id}`});
        if(boost) embed.data.description += `\n${this.client.cache.emojis.ufoboost} ${ctx.response.data.embed.ufoboost}`
        return {reply: {embeds: [embed]}}
    }
}