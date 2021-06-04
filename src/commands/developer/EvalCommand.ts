import AbstractDevCommand from "@/abstractions/commands/AbstractDevCommand";
import IDevCommand from "@/interfaces/DevCommandInterface";
import ICommandMessage from "@/interfaces/CommandMessage";
import Discord from "discord.js";

export default class EvalCommand extends AbstractDevCommand implements IDevCommand {
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

    public async execute(cmd: ICommandMessage) {
        let embed = new Discord.MessageEmbed()
        let content = cmd.args.join(" ")
        if(cmd.flags.delMsg && cmd.message.deletable) await cmd.message.delete()
        try {
            let time = Date.now()
            let result = cmd.flags.noAwait ? eval(content) : await eval(content)
            embed.setColor('#3882f8')
                .setTitle('Completed')
                .setDescription(`**Done in:** ${Date.now() - time}ms\n` + `Type: ${typeof result}\n` + "```js\n" + result + "```")
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