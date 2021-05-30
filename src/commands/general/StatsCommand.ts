import Discord from "discord.js";

import AbstractCommand from "@/abstractions/AbstractCommand";
import ICommand from "@/interfaces/CommandInterface";
import ICommandMessage from "@/interfaces/CommandMessage";

import TimeParser from "@/utils/TimeParser";

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
            .setAuthor(`${reply.embed.stats} ${global.bot.user!.username}`, global.bot.user.avatarURL({dynamic: true})!,
                process.env.WEBSITE + '/stats')
            .addField(reply.embed.stats, `
${global.bot.cache.emojis.presence} ${reply.embed.servers}: ${stats.guilds.reduce((a, b) => a + b, 0)}
${global.bot.cache.emojis.members} ${reply.embed.users}: ${stats.users.reduce((a, b) => a + b, 0)}
${global.bot.cache.emojis.textchannel} ${reply.embed.channels}: ${stats.channels.reduce((a, b) => a + b, 0)}
${global.bot.cache.emojis.emotes} ${reply.embed.emojis}: ${stats.emojis.reduce((a, b) => a + b, 0)}
${global.bot.cache.emojis.announcements} ${reply.embed.shards}: ${stats.guilds.length}`)
            .addField(reply.embed.platform, `
💻 ${reply.embed.os}: ${require('os').type()}
💓 ${reply.embed.ping}: ${Math.round(stats.ping.reduce((a, b) => a + b, 0) / stats.ping.length)} ms
🎛️ ${reply.embed.memory}: ${stats.memory.reduce((a, b) => a + b, 0)} MB
${global.bot.cache.emojis.slowmode} ${reply.embed.uptime}: ${TimeParser.stringify(global.bot.uptime, cmd.language.interface)}`)
            .addField(reply.embed.versions, `
${global.bot.cache.emojis.nodejs} Node JS: ${'`' + process.version + '`'}
${global.bot.cache.emojis.discordjs} discord.js: ${'`' + Discord.version + '`'}`)
        return cmd.message.channel.send(embed);
    }
}