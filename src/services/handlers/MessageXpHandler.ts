import {Guild, GuildMember} from "discord.js";
import AbstractService from "@/abstractions/AbstractService";
import GuildSettings from "@/utils/GuildSettings";
import Balance from "@/types/database/Balance";

export default class MessageXpHandler extends AbstractService {
    constructor(public guild: Guild, public member: GuildMember) {
        super()
    }

    public async handle(): Promise<any> {
        let settings = await GuildSettings.getCache(this.guild.id as string)
        if(!settings.boost) return
        if(!settings.messageXp) return
        let random = Math.round(Math.random()*100)
        if(random >= settings.messageXp.chance) return
        let balance = await this.db.manager.findOneBy(Balance, {
            guildid: this.guild.id as string,
            userid: this.member.id as string
        })
        if (!balance) {
            balance = new Balance()
            balance.guildid = this.guild.id as string;
            balance.userid = this.member.id as string;
            balance.balance = 0;
            balance.xp = 0;
        }
        let xp = Math.floor(settings.messageXp.min + (settings.messageXp.max-settings.messageXp.min) * Math.random())
        balance.xp += xp
        return balance.save()
    }
}