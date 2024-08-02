import {EmbedBuilder, Message, TextChannel} from "discord.js";

import AbstractDeveloperCommand from "@/abstractions/commands/AbstractDeveloperCommand";
import DeveloperCommand from "@/types/commands/DeveloperCommand";
import Resolver from "@/utils/Resolver";
import BoostManager from "@/utils/BoostManager";
import TimeParser from "@/utils/TimeParser";

export default class BoostManagerCommand extends AbstractDeveloperCommand implements DeveloperCommand {
    public name = 'boost-manager'
    public aliases = ['bm']

    public async execute(message: Message, args: Array<string>) {
        let channel = message.channel as TextChannel
        let user = await Resolver.user(message.guild, args[0])
        if (!user) return message.react('💀')
        let count = ['standard', 'premium'].includes(args[1]) ? 0 : Number(args[2])
        if (isNaN(count) || count % 1 || count < 0) return message.react('💀')
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
        let boost
        switch (args[1]) {
            case 'add':
                boost = await BoostManager.add(user.id as string, count)
                embed.setDescription(`Added ${'`' + count.toLocaleString('en') + '`'} boosts to user ${user.username}`
                    + `\nCurrent count of user's boosts: ${'`' + boost.count + '`'}`)
                break
            case 'remove':
                boost = await BoostManager.remove(user.id as string, count)
                embed.setDescription(`Removed ${'`' + count.toLocaleString('en') + '`'} boosts from user ${user.username}`
                    + `\nCurrent count of user's boosts: ${'`' + boost.count + '`'}`)
                break
            case "standard":
                boost = await BoostManager.subscription(user.id as string, 'standard')
                embed.setDescription(`Added standard subscription to user ${user.username}`
                    + `\nCurrent count of user's boosts: ${'`' + boost.count + '`'}`)
                break
            case "premium":
                boost = await BoostManager.subscription(user.id as string, 'premium')
                embed.setDescription(`Added standard subscription to user ${user.username}`
                    + `\nCurrent count of user's boosts: ${'`' + boost.count + '`'}`)
                break
            case "tempadd":
                let duration = TimeParser.all(args[3], 'en')
                if (!duration) return message.react('💀')
                boost = await BoostManager.subscription(user.id as string, 'manager', duration.duration, count)
                embed.setDescription(`Added ${'`' + count.toLocaleString('en') + '`'} boosts to user ${user.username}`
                    + `\nCurrent count of user's boosts: ${'`' + boost.count + '`'}`)
                embed.addFields({name: 'Duration', value: duration.string})
                break
            default:
                return message.react('💀')
        }
        return channel.send({embeds: [embed]})
    }
}