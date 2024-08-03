import {EmbedBuilder, Message, TextChannel} from "discord.js";

import AbstractDeveloperCommand from "@/abstractions/commands/AbstractDeveloperCommand";
import DeveloperCommand from "@/types/commands/DeveloperCommand";
import Resolver from "@/utils/Resolver";
import BoostManager from "@/utils/BoostManager";
import TimeParser from "@/utils/TimeParser";
import Gulag from "@/types/database/Gulag";

export default class BoostManagerCommand extends AbstractDeveloperCommand implements DeveloperCommand {
    public name = 'gulag'
    public aliases = ['blacklist']
    public allowedUsers = ['632923863507927041']

    public async execute(message: Message, args: Array<string>) {
        let channel = message.channel as TextChannel
        let user = await Resolver.user(message.guild, args[0])
        if (!user || user?.id === '591321756799598592') return
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
        if (this.client.cache.gulags.has(user.id)) {
            embed.setDescription('This user is already in gulag')
            return channel.send({embeds: [embed]})
        }
        let days = Number(args[1])
        let reason: string
        if (isNaN(days) || days % 1 || days < 1 || days > 7) {
            days = 0
            reason = args.slice(1).join(" ")
        }
        else reason = args.slice(2).join(" ")
        if (!reason?.trim()?.length) reason = 'Not specified'
        let gulag = new Gulag()
        gulag.userid = user.id as string
        gulag.reason = reason
        await gulag.save()
        await this.client.shard.broadcastEval((client, context) => {
            const ufo = client as typeof this.client
            ufo.cache.gulags.add(context.userId)
            ufo.guilds.cache.forEach(guild => {
                console.log(guild.name, guild.ownerId)
                if (guild.ownerId === context.userId) guild.leave()
            })
            ufo.guilds.cache.get(context.supportGuildId)?.members
                ?.ban(context.userId, {deleteMessageDays: context.days, reason: context.reason})
        }, {context: {userId: user.id, supportGuildId: this.constants.supportGuildId, days, reason}})
        embed.setDescription(`**${user.username}** ${'(`' + user.id + '`)'} has been send to gulag`)
        return channel.send({embeds: [embed]})
    }
}