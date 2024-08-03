import {EmbedBuilder, Message, TextChannel} from "discord.js";

import AbstractDeveloperCommand from "@/abstractions/commands/AbstractDeveloperCommand";
import DeveloperCommand from "@/types/commands/DeveloperCommand";
import Resolver from "@/utils/Resolver";
import BoostManager from "@/utils/BoostManager";
import TimeParser from "@/utils/TimeParser";
import Gulag from "@/types/database/Gulag";

export default class BoostManagerCommand extends AbstractDeveloperCommand implements DeveloperCommand {
    public name = 'ungulag'
    public aliases = ['rmblacklist']
    public allowedUsers = ['632923863507927041']

    public async execute(message: Message, args: Array<string>) {
        let channel = message.channel as TextChannel
        let user = await Resolver.user(message.guild, args[0])
        if (!user || user?.id === '591321756799598592') return
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
        if (!this.client.cache.gulags.has(user.id)) {
            embed.setDescription('This user is not in gulag')
            return channel.send({embeds: [embed]})
        }
        await this.db.manager.delete(Gulag, {userid: user.id})
        await this.client.shard.broadcastEval((client, context) => {
            (client as typeof this.client).cache.gulags.delete(context.userId)
        }, {context: {userId: user.id}})
        embed
            .setColor('#ffb500')
            .setDescription(`**${user.username}** ${'(`' + user.id + '`)'} has been removed from gulag`)
        return channel.send({embeds: [embed]})
    }
}