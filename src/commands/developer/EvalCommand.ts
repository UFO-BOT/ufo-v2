import {inspect} from "util";
import {EmbedBuilder, Message, TextChannel} from "discord.js";

import AbstractDeveloperCommand from "@/abstractions/commands/AbstractDeveloperCommand";
import DeveloperCommand from "@/types/commands/DeveloperCommand";

export default class EvalCommand extends AbstractDeveloperCommand implements DeveloperCommand {
    public name = 'eval'
    public aliases = ['e', 'evaluate']

    public async execute(message: Message, args: Array<string>) {
        let channel = message.channel as TextChannel
        let msg
        try {
            let content = args.join(" ")
            let noReply = false;
            let noAwait = false;
            content = content
                .replace('-delmsg', () => {
                    if(message.deletable) message.delete()
                    return ''
                })
                .replace('-noreply', () => {
                    noReply = true
                    return ''
                })
                .replace('-noawait', () => {
                    noAwait = true
                    return ''
                })
                .replace(/(```)(js)?/gi, "")
            let embed = new EmbedBuilder()
                .setColor(this.constants.colors.system)
                .setDescription(`${this.client.cache.emojis.loading} Processing...`)
            if (!noReply) msg = await channel.send({embeds: [embed]})
            let start = Date.now()
            let result = noAwait ? eval(content) : await eval(content)
            let time = Date.now() - start
            let type = typeof result
            if (type !== 'string') result = inspect(result)
            result = result.replace(new RegExp(this.client.token, 'gmi'), 'CLIENT TOKEN HERE')
            if (result.length > 2000) result = 'Result is too long to display'
            else result = '```js\n' + result + '\n```'
            embed.setDescription(`**Done in:** ${time.toLocaleString('en')}ms\n**Type:** ${type}\n${result}`)
            if (!noReply) return msg.edit({embeds: [embed]})
        }
        catch (e: any) {
            let embed = new EmbedBuilder()
                .setColor(this.constants.colors.error)
                .setDescription('```js\n' + e.name + '\n' + e.message + '\n```')
            return msg ? msg.edit({embeds: [embed]}) : channel.send({embeds: [embed]})
        }
    }
}