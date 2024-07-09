import {Guild} from "discord.js";

export default class GuildVariable {
    public id: string
    public name: string
    public memberCount: string
    public iconUrl: string
    public bannerUrl: string
    public created: number

    constructor(guild: Partial<Guild>) {
        this.id = guild.id as string
        this.name = guild.name
        this.memberCount = String(guild.memberCount)
        this.iconUrl = guild.iconURL()
        this.bannerUrl = guild.bannerURL({size: 2048})
        this.created = guild.createdTimestamp
    }
}