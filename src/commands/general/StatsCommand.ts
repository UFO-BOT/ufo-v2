import Discord from "discord.js";
import moment from "moment";

import AbstractCommand from "@/abstractions/AbstractCommand";
import ICommand from "@/interfaces/CommandInterface";
import ICommandMessage from "@/interfaces/CommandMessage";

import replies from '@/properties/replies.json'

export default class StatsCommand extends AbstractCommand implements ICommand {
    public static isCommand = true

    public ru = {
        name: 'стат',
        aliases: ['статистика', 'стата', 'бот-стат'],
        category: 'Основное',
        description: 'Показывает статистику бота',
        usage: 'стат'
    }
    public en = {
        name: 'stats',
        aliases: ['commands', 'h'],
        category: 'General',
        description: 'Shows bot statistics',
        usage: 'stats'
    }

    public async execute(cmd: ICommandMessage): Promise<any> {
        const reply = replies.stats[cmd.language.interface];

        let stats = {
            guilds: await global.bot.shard.fetchClientValues('guilds.cache.size'),
            users: await global.bot.shard.fetchClientValues('users.cache.size'),
            channels: await global.bot.shard.fetchClientValues('channels.cache.size'),
            emojis: await global.bot.shard.fetchClientValues('emojis.cache.size'),
            memory: await global.bot.shard.broadcastEval('Math.round(process.memoryUsage().heapUsed / 1024 ** 2)'),
            ping: await global.bot.shard.fetchClientValues('ws.ping')
        }

        let embed = new Discord.MessageEmbed()
            .setColor('#3882f8')
            .setAuthor(`${reply.embed.stats} ${global.bot.user!.username}`, global.bot.user.avatarURL({dynamic: true})!, 'https://ufobot.ru/stats')
            .addField(reply.embed.stats, `
<:presence:718892140876398663> ${reply.embed.servers}: ${stats.guilds.reduce((a, b) => a + b, 0)}
<:members:716373602655797248> ${reply.embed.users}: ${stats.users.reduce((a, b) => a + b, 0)}
<:textchannel:716371584474021928> ${reply.embed.channels}: ${stats.channels.reduce((a, b) => a + b, 0)}
<:emotes:716368817332289627> ${reply.embed.emojis}: ${stats.emojis.reduce((a, b) => a + b, 0)}
<:announcements:762690743047290940> ${reply.embed.shards}: ${stats.guilds.length}
`)
            .addField(reply.embed.platform, `
:computer: ${reply.embed.os}: ${require('os').type()}
:heartbeat: ${reply.embed.ping}: ${Math.round(stats.ping.reduce((a, b) => a + b, 0) / stats.ping.length)} ms
:control_knobs: ${reply.embed.memory}: ${stats.memory.reduce((a, b) => a + b, 0)} MB
<:uptime:718984650956996678> ${reply.embed.uptime}: ${global.bot.uptime}
:outbox_tray: ${reply.embed.readyAt}: ${
                // @ts-ignore
                moment(global.bot.readyTimestamp).tz('UTC').format('D.MM.YYYY, `kk:mm:ss` ') + '(GMT+0000)'
            }`)
            .addField(reply.embed.versions, `
${global.bot.cache.emojis.nodejs} Node JS: ${'`' + process.version + '`'}
${global.bot.cache.emojis.discordjs} discord.js: ${'`' + Discord.version + '`'}`)
        return cmd.message.channel.send(embed);
    }
}