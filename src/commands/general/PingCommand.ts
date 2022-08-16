import Discord, {ApplicationCommandOptionType, EmbedBuilder, Message} from "discord.js";

import Command from "@/types/Command";
import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import CommandOption from "@/types/CommandOption";
import CommandCategory from "@/types/CommandCategory";
import CommandExecutionContext from "@/types/CommandExecutionContext";
import CommandExecutionResult from "@/types/CommandExecutionResult";
import {Writable} from "stream";
import Balance from "@/types/database/Balance";

export default class PingCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "пинг",
            description: 'Показывает пинг бота, пинг базы данных, время изменения сообщений и состояние дискорда',
            aliases: ['статус']
        },
        en: {
            name: "ping",
            description: 'Shows bot ping, database ping, message edit time and Discord state',
            aliases: ['status']
        }
    }
    public options: Array<CommandOption> = []
    public category = CommandCategory.General;

    public async execute(ctx: CommandExecutionContext): Promise<CommandExecutionResult> {
        let DBTime = Date.now()
        await global.mongo.mongoManager.findOneBy(Balance, {})
        let DBPing = Date.now() - DBTime;
        let embed = new EmbedBuilder()
            .setColor(process.env.SYSTEM_COLOR)
            .setDescription(ctx.response.data.embed.pinging + '..');
        return {reply: {embeds: [embed]}, data: {embed: embed, DBPing: DBPing}}
    }

    public async after(ctx: CommandExecutionContext, message: Message) {
        ctx.data.embed.data.description += '.'
        let editStart = Date.now();
        message = await message.edit({embeds: [ctx.data.embed]})
        let editPing = Date.now() - editStart;
        ctx.data.embed.setTitle(ctx.response.data.embed.title)
        let emojis = ['dnd', 'idle', 'online']
        let statuses = {
            bot: this.statusNumber(global.client.ws.ping, {operational: 100, outage: 1000}),
            db: this.statusNumber(ctx.data.DBPing, {operational: 150, outage: 500}),
            edit: this.statusNumber(editPing, {operational: 400, outage: 1500})
        }
        ctx.data.embed.setDescription(`
**${global.client.cache.emojis[emojis[statuses.bot]]} ${ctx.response.data.embed.bot}:** ${global.client.ws.ping} ms
**${global.client.cache.emojis[emojis[statuses.db]]} ${ctx.response.data.embed.database}:** ${ctx.data.DBPing} ms
**${global.client.cache.emojis[emojis[statuses.edit]]} ${ctx.response.data.embed.edit}:** ${editPing} ms
        `)
        let colors = ['#ff2a2a', '#ffc800', '#00ff8c']
        let midStatus = Math.round(Object.values(statuses).reduce((a, b) => a + b, 0) /
            Object.keys(statuses).length);
        ctx.data.embed.setColor(colors[midStatus]);
        await message.edit({embeds: [ctx.data.embed]})
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