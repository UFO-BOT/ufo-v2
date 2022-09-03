import Discord, {EmbedBuilder} from "discord.js";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/Command";

import TimeParser from "../../utils/TimeParser";
import CommandOption from "@/types/CommandOption";
import CommandCategory from "@/types/CommandCategory";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import CommandExecutionResult from "@/types/CommandExecutionResult";

export default class StatsCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "стат",
            description: 'Показывает статистику бота',
            aliases: ['статистика', 'стата', 'бот-стат']
        },
        en: {
            name: "stats",
            description: 'Shows bot statistics',
            aliases: ['statistics', 'bot-stats']
        }
    }
    public options: Array<CommandOption> = []
    public category = CommandCategory.General;

    public async execute(ctx: CommandExecutionContext): Promise<CommandExecutionResult> {
        let stats = {
            guilds: await global.client.shard.fetchClientValues('guilds.cache.size') as Array<number>,
            users: await global.client.shard.fetchClientValues('users.cache.size') as Array<number>,
            channels: await global.client.shard.fetchClientValues('channels.cache.size') as Array<number>,
            emojis: await global.client.shard.fetchClientValues('emojis.cache.size') as Array<number>,
            memory: await global.client.shard.broadcastEval(() =>
                Math.round(process.memoryUsage().heapUsed / 1024 ** 2)) as Array<number>,
            ping: await global.client.shard.fetchClientValues('ws.ping') as Array<number>
        }

        let embed = new EmbedBuilder()
            .setColor(global.constants.colors.system)
            .setAuthor({name: `${ctx.response.data.embed.stats} ${global.client.user!.username}`,
                iconURL: global.client.user.avatarURL(),
                url: process.env.WEBSITE + '/stats'})
            .addFields({name: ctx.response.data.embed.stats, value:
`${global.client.cache.emojis.presence} ${ctx.response.data.embed.servers}: ${stats.guilds.reduce((a, b) => a + b, 0)}
${global.client.cache.emojis.members} ${ctx.response.data.embed.users}: ${stats.users.reduce((a, b) => a + b, 0)}
${global.client.cache.emojis.textchannel} ${ctx.response.data.embed.channels}: ${stats.channels.reduce((a, b) => a + b, 0)}
${global.client.cache.emojis.emotes} ${ctx.response.data.embed.emojis}: ${stats.emojis.reduce((a, b) => a + b, 0)}
${global.client.cache.emojis.announcements} ${ctx.response.data.embed.shards}: ${stats.guilds.length}`})
            .addFields({name: ctx.response.data.embed.platform, value:
`💻 ${ctx.response.data.embed.os}: ${require('os').type()}
💓 ${ctx.response.data.embed.ping}: ${Math.round(stats.ping.reduce((a: number, b: number) => a + b, 0) / stats.ping.length)} ms
🎛️ ${ctx.response.data.embed.memory}: ${stats.memory.reduce((a, b) => a + b, 0)} MB
${global.client.cache.emojis.slowmode} ${ctx.response.data.embed.uptime}: ${TimeParser.formatTimestamp(global.client.readyTimestamp, "R")}`})
            .addFields({name: ctx.response.data.embed.versions, value:
`${global.client.cache.emojis.nodejs} Node JS: ${'`' + process.version + '`'}
${global.client.cache.emojis.discordjs} discord.js: ${'`' + Discord.version + '`'}`})
        return {reply: {embeds: [embed]}}
    }
}