import Discord from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import CommandConfig from "@/types/CommandConfig";
import CommandMessage from "@/types/CommandMessage";

import Resolver from "@/utils/Resolver";
import Balance from "@/types/database/Balance";

import replies from '@/properties/replies.json'

export default class StatsCommand extends AbstractCommand implements CommandConfig {
    public ru = {
        name: 'баланс',
        aliases: ['деньги', 'бал'],
        category: 'Экономика',
        description: 'Отправляет количество денег и опыта указанного участника или участника, вызвавшего эту команду',
        usage: 'баланс [участник]'
    }
    public en = {
        name: 'balance',
        aliases: ['money', 'bal'],
        category: 'Economy',
        description: 'Sends the amount of money and experience of specified member or member who used this command',
        usage: 'balance [member]'
    }

    public async execute(cmd: CommandMessage) {
        const reply = replies.balance[cmd.language.interface];

        let member = await Resolver.member(cmd.message, cmd.args[0]);
        if(!member) member = cmd.message.member;
        let memberBalance = await global.mongo.findOne<Balance>('balances', 
            {guildid: cmd.message.guild.id, userid: member.user.id})
        if(!memberBalance) {
            let embed = new Discord.MessageEmbed()
                .setColor('#3882f8')
                .setAuthor(member.user.tag, member.user.avatarURL({dynamic: true}))
                .addField(reply.embed.field1, "0" + cmd.moneysymb, true)
                .addField(reply.embed.field2, "0" + global.bot.cache.emojis.xp, true)
            return cmd.message.channel.send(embed);
        }
        let top = await global.mongo.find<Balance>('balances', {guildid: cmd.message.guild.id})
        top.sort((a, b) => b.balance - a.balance);
        let topMember = top.find(m => m.userid === memberBalance.userid);
        let place = String(top.indexOf(topMember) + 1);
        let embed = new Discord.MessageEmbed()
            .setColor('#3882f8')
            .setDescription(reply.embed.description.replace('{{place}}', place))
            .setAuthor(member.user.tag, member.user.avatarURL({dynamic: true}),
                `${process.env.WEBSITE}/${cmd.message.guild.id}/${member.user.id}`)
            .addField(reply.embed.field1, memberBalance.balance + cmd.moneysymb, true)
            .addField(reply.embed.field2, memberBalance.xp + global.bot.cache.emojis.xp, true)
        return cmd.message.channel.send(embed);
    }
}