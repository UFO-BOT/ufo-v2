import Discord from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import CommandConfig from "@/types/CommandConfig";
import CommandMessage from "@/types/CommandMessage";

import Balance from "@/types/database/Balance";
import Settings from "@/types/database/Settings";

import replies from '@/properties/replies.json'
import CommandError from "@/utils/CommandError";

export default class StatsCommand extends AbstractCommand implements CommandConfig {
    public ru = {
        name: 'работать',
        aliases: ['работа', 'заработать'],
        category: 'Экономика',
        description: 'Работать и заработать деньги',
        usage: 'работать'
    }
    public en = {
        name: 'work',
        aliases: ['earn'],
        category: 'Economy',
        description: 'Work and earn money',
        usage: 'work'
    }

    public async execute(cmd: CommandMessage) {
        const reply = replies.work[cmd.language.interface];

        let memberBalance = await global.mongo.findOrInsert<Balance>('balances',
            {guildid: cmd.message.guild.id, userid: cmd.message.author.id}, {
                guildid: cmd.message.guild.id,
                userid: cmd.message.guild.id,
                balance: 0,
                lastwork: 0,
                xp: 0
            })
        let settings = await global.mongo.findOne<Settings>('settings', {guildid: cmd.message.guild.id})

        let { salary, workcooldown } = settings

        let isCooldown = Date.now() - memberBalance.lastwork
        if(isCooldown < workcooldown)
            return CommandError.userCooldown(cmd.message, workcooldown - isCooldown, cmd.language.interface)

        memberBalance.lastwork = Date.now()

        let money = Math.floor(salary.low + (salary.high - salary.low) * Math.random())
        memberBalance.balance += money;
        await global.mongo.save('balances', memberBalance)

        let embed = new Discord.MessageEmbed()
            .setColor('#00ff66')
            .setAuthor(reply.embed.author, cmd.message.author.avatarURL({dynamic: true}))
            .setDescription(reply.embed.description
                .replace('{{salary}}', String(money))
                .replace(/{{monsymb}}/g, cmd.moneysymb)
                .replace('{{balance}}', String(memberBalance.balance))
            )
        return cmd.message.channel.send(embed)
    }
}