import {execSync} from "child_process";
import {Message, TextChannel} from "discord.js";

import AbstractDeveloperCommand from "@/abstractions/commands/AbstractDeveloperCommand";
import DeveloperCommand from "@/types/commands/DeveloperCommand";

export default class EvalCommand extends AbstractDeveloperCommand implements DeveloperCommand {
    public name = 'exec'
        public aliases = ['execute', 'shell', '$']

    public async execute(message: Message, args: Array<string>) {
        let channel = message.channel as TextChannel
        try {
            let content = args.join(" ");
            let noReply = false;
            content = content
                .replace('-delmsg', () => {
                    if(message.deletable) message.delete()
                    return ''
                })
                .replace('-noreply', () => {
                    noReply = true
                    return ''
                })
            let start = Date.now()
            let result = execSync(content, {encoding: 'utf-8'})
            let time = Date.now() - start
            if(result.length > 2000) result = 'Result is too long to display'
            return channel.send({content: '```xl\n' + `Done in: ${time}ms\n` + result + '\n```'})
        }
        catch (e: any) {
            return channel.send('```xl\n' + `${e.name}\n${e.message}` + '```')
        }
    }
}