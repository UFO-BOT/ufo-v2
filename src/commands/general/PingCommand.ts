import Discord from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import CommandConfig from "@/types/CommandConfig";
import CommandMessage from "@/types/CommandMessage";

import replies from '@/properties/replies.json'

export default class StatsCommand extends AbstractCommand implements CommandConfig {
    public ru = {
        name: 'пинг',
        aliases: ['статус'],
        category: 'Основное',
        description: 'Показывает пинг бота, пинг базы данных, время изменения сообщений и состояние дискорда',
        usage: 'пинг'
    }
    public en = {
        name: 'ping',
        aliases: ['status'],
        category: 'General',
        description: 'Shows bot ping, database ping, message edit time and Discord state\n',
        usage: 'ping'
    }

    public async execute(cmd: CommandMessage) {
        const reply = replies.ping[cmd.language.interface];

        let dbtime = Date.now()
        await global.mongo.findOne('balances', {})
        let dbping = Date.now() - dbtime;
        let embed = new Discord.MessageEmbed()
            .setColor(cmd.color.system)
            .setDescription(reply.embed.pinging + '..');
        let msg = await cmd.message.channel.send(embed);
        embed.description += '.'
        msg = await msg.edit(embed)
        let editPing = msg.editedTimestamp - msg.createdTimestamp;
        embed.setTitle(reply.embed.title)
        let emojis = ['dnd', 'idle', 'online']
        let statuses = {
            bot: this.statusNumber(global.bot.ws.ping, {operational: 100, outage: 1000}),
            db: this.statusNumber(dbping, {operational: 150, outage: 500}),
            edit: this.statusNumber(editPing, {operational: 400, outage: 1500})
        }
        embed.setDescription(`
**${global.bot.cache.emojis[emojis[statuses.bot]]} ${reply.embed.bot}:** ${global.bot.ws.ping} ms
**${global.bot.cache.emojis[emojis[statuses.db]]} ${reply.embed.database}:** ${dbping} ms
**${global.bot.cache.emojis[emojis[statuses.edit]]} ${reply.embed.edit}:** ${editPing} ms
        `)
        let colors = ['#f04747', '#ffc800', '#5abd90']
        let midStatus = Math.round(Object.values(statuses).reduce((a, b) => a + b, 0) /
            Object.keys(statuses).length);
        embed.setColor(colors[midStatus]);
        return msg.edit(embed)
    }

    private statusNumber(ping: number, values: {operational: number, outage: number}): number {
        switch (true) {
            case ping <= values.operational:
                return 2
            case ping > values.operational && ping <= values.outage:
                return 1
            case ping > values.outage:
                return 0
        }
    }
}