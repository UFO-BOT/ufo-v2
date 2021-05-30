import Discord from "discord.js";
import moment from "moment";

import AbstractCommand from "@/abstractions/AbstractCommand";
import ICommand from "@/interfaces/CommandInterface";
import ICommandMessage from "@/interfaces/CommandMessage";

import replies from '@/properties/replies.json'
import ISettings from "@/interfaces/database/SettingsInterface";

export default class ServerCommand extends AbstractCommand implements ICommand {
    public ru = {
        name: 'сервер',
        aliases: ['сервер-инфо', 'серверинфо'],
        category: 'Основное',
        description: 'Показывает информацию о сервере',
        usage: 'сервер'
    }
    public en = {
        name: 'server',
        aliases: ['commands', 'h'],
        category: 'General',
        description: 'Shows information about the server',
        usage: 'server'
    }

    public async execute(cmd: ICommandMessage): Promise<any> {
        const reply:any = replies.server[cmd.language.interface];

        let emojis = global.bot.cache.emojis;
        let bans = await cmd.message.guild.fetchBans().catch(() => undefined)
        let invites = await cmd.message.guild.fetchInvites().catch(() => undefined)
        let setting = await global.mongo.getOne<ISettings>('settings', {guildid: cmd.message.guild.id});
        let boosts = cmd.message.guild.premiumSubscriptionCount ?
            `\n**<a:boost:751699949799866459> ${reply.embed.boosts}:** ${cmd.message.guild.premiumSubscriptionCount}` : ''
        let splash = cmd.message.guild.splashURL() && cmd.message.guild.bannerURL() ?
            `\n[**:frame_photo: ${reply.embed.splash}**](${cmd.message.guild.splashURL({format: 'gif'})})` : ''
        let embed = new Discord.MessageEmbed()
            .setColor('#00ccff')
            .setTitle(cmd.message.guild.name)
            .setDescription(`
**${emojis.verification} ${reply.embed.verification}:** ${reply.levels[cmd.message.guild.verificationLevel]}
**${emojis.owner} ${reply.embed.owner}:** ${cmd.message.guild.owner}
**${emojis.invite} ${reply.embed.invites}:** ${invites?.size ?? reply.embed.missingPermissions}
**🔨 ${reply.embed.bans}:** ${bans?.size ?? reply.embed.missingPermissions} ${boosts}
**${emojis.textchannel} ${reply.embed.shard}:** #${cmd.message.guild.shardID}
**🕐 ${reply.embed.creationDate}:** ${moment(cmd.message.guild.createdTimestamp).utc().format('D.MM.YYYY, `kk:mm:ss`')} (GMT+0000) ${splash}`)
            .addField(`${reply.embed.channels} [${cmd.message.guild.channels.cache.size}]`, `
${emojis.textchannel} ${reply.embed.text}: ${cmd.message.guild.channels.cache.filter(c => c.type === 'text').size}
${emojis.voice} ${reply.embed.voice}: ${cmd.message.guild.channels.cache.filter(c => c.type === 'voice').size}
${emojis.announcements} ${reply.embed.announcements}: ${cmd.message.guild.channels.cache.filter(c => c.type === 'news').size}
${emojis.presence} ${reply.embed.categories}: ${cmd.message.guild.channels.cache.filter(c => c.type === 'category').size}
                `, true)
            .addField(reply.embed.stats, `
${emojis.members} ${reply.embed.memberCount}: ${cmd.message.guild.memberCount}
${emojis.textchannel} ${reply.embed.channelCount}: ${cmd.message.guild.channels.cache.size}
${emojis.roles} ${reply.embed.roleCount}: ${cmd.message.guild.roles.cache.size}
${emojis.emotes} ${reply.embed.emojiCount}: ${cmd.message.guild.emojis.cache.size}`, true)
            .setThumbnail(cmd.message.guild.iconURL({dynamic: true}))
            .setImage(cmd.message.guild.bannerURL({format: 'gif'}) ?? cmd.message.guild.splashURL({size: 2048, format: 'gif'}))
            .setFooter(`ID: ${cmd.message.guild.id}`);
        if(setting?.boost) embed.description += `\n${global.bot.cache.emojis.ufoboost} ${reply.embed.ufoboost}`
        return cmd.message.channel.send(embed);
    }
}