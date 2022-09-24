import Discord, {ApplicationCommandOptionType, EmbedBuilder, Message} from "discord.js";

import Command from "@/types/commands/Command";
import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import {Writable} from "stream";
import Balance from "@/types/database/Balance";

interface PingCommandData {
    embed: EmbedBuilder
    DBPing: number
    response: any
}

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
        await this.db.mongoManager.findOneBy(Balance, {})
        let DBPing = Date.now() - DBTime;
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setDescription(ctx.response.data.embed.pinging + '..');
        return {reply: {embeds: [embed]}, data: {embed: embed, DBPing: DBPing, response: ctx.response}}
    }

    public async after(message: Message, data: PingCommandData) {
        data.embed.data.description += '.'
        let editStart = Date.now();
        message = await message.edit({embeds: [data.embed]})
        let editPing = Date.now() - editStart;
        data.embed.setTitle(data.response.data.embed.title)
        let emojis = ['dnd', 'idle', 'online']
        let statuses = {
            bot: this.statusNumber(this.client.ws.ping, {operational: 100, outage: 1000}),
            db: this.statusNumber(data.DBPing, {operational: 150, outage: 500}),
            edit: this.statusNumber(editPing, {operational: 400, outage: 1500})
        }
        data.embed.setDescription(`
**${this.client.cache.emojis[emojis[statuses.bot]]} ${data.response.data.embed.bot}:** ${this.client.ws.ping} ms
**${this.client.cache.emojis[emojis[statuses.db]]} ${data.response.data.embed.database}:** ${data.DBPing} ms
**${this.client.cache.emojis[emojis[statuses.edit]]} ${data.response.data.embed.edit}:** ${editPing} ms
        `)
        let colors = [this.constants.colors.error, this.constants.colors.warning, this.constants.colors.success]
        let midStatus = Math.round(Object.values(statuses).reduce((a, b) => a + b, 0) /
            Object.keys(statuses).length);
        data.embed.setColor(colors[midStatus]);
        await message.edit({embeds: [data.embed]})
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