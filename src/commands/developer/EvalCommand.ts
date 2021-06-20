import Discord from "discord.js";
import { inspect } from "util";

import AbstractDevCommand from "@/abstractions/commands/AbstractDevCommand";
import DevCommand from "@/types/DevCommandConfig";
import CommandMessage from "@/types/CommandMessage";

export default class EvalCommand extends AbstractDevCommand implements DevCommand {
    public name = 'eval'
    public aliases = ['e', 'evaluate']
    public flags = [
        {
            name: 'noReply',
            usages: ['-noreply', '--no-reply', '-n']
        },
        {
            name: 'delMsg',
            usages: ['-delmsg', '-d']
        },
        {
            name: 'noAwait',
            usages: ['-noawait', '--no-await', '-nw']
        }
    ]

    public async execute(cmd: CommandMessage) {
        let embed = new Discord.MessageEmbed()
        let content = cmd.args.join(" ")
        if(cmd.flags.delMsg && cmd.message.deletable) await cmd.message.delete()
        try {
            let time = Date.now()
            let result = cmd.flags.noAwait ? eval(content) : await eval(content)
            let type = typeof result;
            if(typeof result !== 'string') result = inspect(result)
            result = result.replace(new RegExp(process.env.TOKEN, 'gmi'), 'Токен сливать нельзя')
            embed.setColor('#3882f8')
                .setTitle('Completed')
                .setDescription(`**Done in:** ${Date.now() - time}ms\n` + `**Type:** ${type}\n` +
                    (result.length < 2000 ? "```js\n" + result + "```" : "Result is too long to display"))
            if(!cmd.flags.noReply) return cmd.message.channel.send(embed)
        }
        catch (error) {
            embed.setColor('#ff173a')
                .setTitle('Error')
                .setDescription("```js\n" + error.name + "\n" + error.message + "```")
            return cmd.message.channel.send(embed)
        }
    }
}