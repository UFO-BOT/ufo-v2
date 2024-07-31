import {execSync} from "child_process";
import {EmbedBuilder, Message, TextChannel} from "discord.js";

import AbstractDeveloperCommand from "@/abstractions/commands/AbstractDeveloperCommand";
import DeveloperCommand from "@/types/commands/DeveloperCommand";

export default class ReloadCommand extends AbstractDeveloperCommand implements DeveloperCommand {
    public name = 'reload'
    public aliases = ['r']

    public async execute(message: Message, args: Array<string>) {
        if(!args[0]) return message.react('💀')
        if(args.includes('-pull')) {
            args.splice(args.indexOf('-pull'), 1);
            execSync('git pull origin master')
        }
        if(args.includes('-tsc')) {
            args.splice(args.indexOf('-tsc'), 1);
            execSync('tsc')
        }
        switch (args[0].toLowerCase()) {
            case 'commands':
            case 'cmds':
                await this.client.shard.broadcastEval(client => (client as typeof this.client).loader.loadCommands())
                break
            case 'devcommands':
            case 'devcmds':
                await this.client.shard.broadcastEval(client => (client as typeof this.client).loader.loadCommands())
                break
            case 'events':
                await this.client.shard.broadcastEval(client => (client as typeof this.client).loader.loadEvents())
                break
            case 'activity':
                await this.client.shard.broadcastEval(client => (client as typeof this.client).activity())
                break
            case 'all':
                await this.client.shard.broadcastEval(client => (client as typeof this.client).load())
                break
            default:
                return message.react('💀')
        }
        let emojis = ['😈', '🍾', '🥰', '🤗', '🫡']
        return message.react(emojis[Math.floor(Math.random()*emojis.length)])
    }
}