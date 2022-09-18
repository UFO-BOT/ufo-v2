import Discord, {EmbedBuilder} from "discord.js";

import AbstractCommand from "../../abstractions/commands/AbstractCommand";
import Command from "../../types/commands/Command";

import TimeParser from "../../utils/TimeParser";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";

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
            guilds: await this.client.shard.fetchClientValues('guilds.cache.size') as Array<number>,
            users: await this.client.shard.fetchClientValues('users.cache.size') as Array<number>,
            channels: await this.client.shard.fetchClientValues('channels.cache.size') as Array<number>,
            emojis: await this.client.shard.fetchClientValues('emojis.cache.size') as Array<number>,
            memory: await this.client.shard.broadcastEval(() =>
                Math.round(process.memoryUsage().heapUsed / 1024 ** 2)) as Array<number>,
            ping: await this.client.shard.fetchClientValues('ws.ping') as Array<number>
        }

        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: `${ctx.response.data.embed.stats} ${this.client.user!.username}`,
                iconURL: this.client.user.avatarURL(),
                url: process.env.WEBSITE + '/stats'})
            .addFields({name: ctx.response.data.embed.stats, value:
`${this.client.cache.emojis.presence} ${ctx.response.data.embed.servers}: ${stats.guilds.reduce((a, b) => a + b, 0).toLocaleString(ctx.settings.language.interface)}
${this.client.cache.emojis.members} ${ctx.response.data.embed.users}: ${stats.users.reduce((a, b) => a + b, 0).toLocaleString(ctx.settings.language.interface)}
${this.client.cache.emojis.textchannel} ${ctx.response.data.embed.channels}: ${stats.channels.reduce((a, b) => a + b, 0).toLocaleString(ctx.settings.language.interface)}
${this.client.cache.emojis.emotes} ${ctx.response.data.embed.emojis}: ${stats.emojis.reduce((a, b) => a + b, 0).toLocaleString(ctx.settings.language.interface)}
${this.client.cache.emojis.announcements} ${ctx.response.data.embed.shards}: ${stats.guilds.length.toLocaleString(ctx.settings.language.interface)}`})
            .addFields({name: ctx.response.data.embed.platform, value:
`💻 ${ctx.response.data.embed.os}: ${require('os').type()}
💓 ${ctx.response.data.embed.ping}: ${Math.round(stats.ping.reduce((a: number, b: number) => a + b, 0) / stats.ping.length)} ms
🎛️ ${ctx.response.data.embed.memory}: ${stats.memory.reduce((a, b) => a + b, 0).toLocaleString(ctx.settings.language.interface)} MB
${this.client.cache.emojis.slowmode} ${ctx.response.data.embed.uptime}: ${TimeParser.formatTimestamp(this.client.readyTimestamp, "R")}`})
            .addFields({name: ctx.response.data.embed.versions, value:
`${this.client.cache.emojis.nodejs} Node JS: ${'`' + process.version + '`'}
${this.client.cache.emojis.discordjs} discord.js: ${'`' + Discord.version + '`'}`})
        return {reply: {embeds: [embed]}}
    }
}